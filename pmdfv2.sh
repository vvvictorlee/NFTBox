#!/bin/bash
sum=20000
for ((i=1; i<=140000; i+=sum))
do
    yarn mdfv2 $i  $sum &
    sleep 3
done

