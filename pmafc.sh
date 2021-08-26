#!/bin/bash
sum=2000
for ((i=103151; i<=120000; i+=sum))
do
    yarn mafc:test $i  $sum &
    sleep 3
done

