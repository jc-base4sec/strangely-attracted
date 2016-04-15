#!/usr/local/bin/python

import optparse


def convert(sequences):
    coordinates = []

    max_count = 100000
    num = 0
    n1th = 0
    n2th = 0
    n3th = 0

    for number in sequences:
        nth = int(number)
        x1 = (nth - n1th)
        y1 = (n1th - n2th)
        z1 = (n2th - n3th)
        # print "ISN: %s; x=%s, y=%s, z=%s" % (number, x1, y1, z1)
        n3th = n2th
        n2th = n1th
        n1th = nth
        num += 1
        if num > max_count:
            break
        coordinates.append((x1, y1, z1))
    return coordinates


def main():
    parser = optparse.OptionParser("usage %prog" + ' -s <sequence file>')
    parser.add_option('-s', dest='sequence_file', type='string', help='specify sequence file')
    (options, args) = parser.parse_args()
    if options.sequence_file is None:
        print parser.usage
        exit(0)
    f = open(options.sequence_file)
    for coordinate in convert(f):
        print str(coordinate[0]) + ',' + str(coordinate[1]) + ',' + str(coordinate[2])

if __name__ == '__main__':
    main()
