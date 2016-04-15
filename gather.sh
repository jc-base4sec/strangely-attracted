#!/bin/bash
#
#  An Empirical Approach to TCP/IP Sequence Number Analysis
#  --------------------------------------------------------
#
#  This utility is free software; you can redistribute it and/or
#  modify it under the terms of the GNU Lesser General Public
#  License as published by the Free Software Foundation; either
#  version 2 of the License, or (at your option) any later version.
#
#  (C) 2001 Michal Zalewski <lcamtuf@razor.bindview.com>
#


if [ "$2" = "" ]; then
  echo "Usage: host open_port"
  echo
  exit 1
fi

( tcpdump -vv -n "tcp and src host $1 and src port $2" \
| grep "S\." | awk -F',' '{print $3}' | awk -F' ' '{print $2}' >sequence_log.txt ) &

sleep 1

CNT=0

while [ "$CNT" -lt "200000" ]; do
  CNT=$[CNT+1]
  echo -en "Collecting seq numbers: $CNT... \r" 1>&2
  nc -z $1 $2
done
