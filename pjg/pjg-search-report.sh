#!/bin/bash
#
if [ -n "$1" ]; then
   #echo "id 123456789ABCD123456789ABCD123456789ABCD123456789ABCD123456789ABCD"
   #echo $(cat pjg-report.txt | head -n$((2*$1))| tail -n2)
   #q=$(cat pjg-report.txt | head -n$((2*$1))| tail -n1)
   printf "%s\n" $(grep "$1" pjg-ttt.txt)
   exit 0
fi
echo ./pjg-search.sh keyword
exit 1
