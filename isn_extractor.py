#!/usr/local/bin/python
# Extract the ISNs from a packet capture for a single ip.

import dpkt
import socket
import optparse


def ip_to_str(address):
    return socket.inet_ntop(socket.AF_INET, address)


def extract_isn(pcap, target_ip):
    isns = []

    for timestamp, buf in pcap:
        eth = dpkt.ethernet.Ethernet(buf)
        if eth.type != dpkt.ethernet.ETH_TYPE_IP:
            continue
        ip = eth.data

        if ip.p == dpkt.ip.IP_PROTO_TCP:
            tcp = ip.data
            syn_flag = (tcp.flags & dpkt.tcp.TH_SYN) != 0
            ack_flag = (tcp.flags & dpkt.tcp.TH_ACK) != 0

            if syn_flag and not ack_flag:
                # Syn, so match ip to source
                if target_ip == ip_to_str(ip.src):
                    isns.append(tcp.seq)
            elif syn_flag and ack_flag:
                # Syn Ack, so match ip to destination
                if target_ip == ip_to_str(ip.dst):
                    isns.append(tcp.seq)

    return isns


def main():
    parser = optparse.OptionParser("usage %prog" + '-f <pcap file> -t <target ip>')
    parser.add_option('-f', dest='capture_file', type='string', help='specify capture file')
    parser.add_option('-t', dest='target', type='string', help='specify ip')
    (options, args) = parser.parse_args()
    if options.capture_file is None or options.target is None:
        print parser.usage
        exit(0)
    f = open(options.capture_file)
    pcap = dpkt.pcap.Reader(f)
    for isn in extract_isn(pcap, options.target):
        print isn

if __name__ == '__main__':
    main()
