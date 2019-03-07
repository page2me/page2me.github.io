#!/bin/bash
title_name="สอบปลายภาค 2/61"
#font_family="Trirong"
#oid="miyazaki"
awk -v title_name="$title_name" '{gsub(/\$title_name/,title_name);}1' $1
#awk -v title_name="$title_name" '{gsub(/\$title_name/,title_name);}1' $1 > $2
#awk -v font_family="$font_family" '{gsub(/\$font_family/,font_family);}1' $1 > $2
#awk -v oid="$oid" '{gsub(/\$oid/,oid);}1'  $1 > $2

