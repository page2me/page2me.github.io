#!/bin/bash
libreoffice --invisible --convert-to html $1.xlsx
cat $1.html | sed 's/<td [^>]*>/<td>/g' | sed 's/<\/font>//g' | sed 's/<font [^>]*>//g' | tac | head -n-61 | tac >  $1.html.tmp
#cat $1.0.html | tac | head -n-71 | tac > exam-body.html
./exam_table_gen.sh  exam-header.html > exam-header.html.tmp
cat exam-header.html.tmp $1.html.tmp > $1.html
