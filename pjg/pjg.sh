#!/bin/bash
#
# ./pjg.sh input-ttt.txt input-pjg.txt|bash|bash|awk '{print "echo \"ibase=16;obase=2;"$1"\"|bc "}'|bash|sed -e :a -e 's/^.\{1,64\}$/0&/;ta' > pjg-out-bin.txt
# ./pjg.sh input-ttt.txt input-pjq.txt|bash|bash|sed -e :a -e 's/^.\{1,16\}$/0&/;ta' > pjg-out-hex.txt
# paste -d":" input-pjg.txt pjg-out-bin.txt pjg-out-hex.txt  > pjg-ttt.txt

if [ -n "$1" ] && [ -n "$2" ]; then
  while read header;
  do
    IFS=':' read -r -a a <<< "$header"
    IFS='|' read -r -a b <<< "${a[1]}"
    len=${#b[@]}
    if [ $len -eq 4 ]
    then
      echo "grep -E \"${a[1]}\" $1 | cut -d\":\" -f3 | tr \"\n\" \":\" | awk -F: '{print \"printf \\\"%X\\\n\\\" \$((0x\" \$1 \" & 0x\" \$2 \" & 0x\" \$3 \" & 0x\" \$4 \"))\"}'"
    else
      echo "grep -E \"${a[1]}\" $1 | cut -d\":\" -f3 | tr \"\n\" \":\" | awk -F: '{print \"printf \\\"%X\\\n\\\" \$((0x\" \$1 \" & 0x\" \$2 \" & 0x\" \$3 \" & 0x\" \$4 \" & 0x\" \$5\"))\"}'"
    fi
  done < $2
  exit 0
fi
  echo ./pjg.sh file_ttt file_pjg
exit 1

