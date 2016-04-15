# strangely-attracted
A half-baked port of Michal Zalewski's initial sequence number strange attractor visualizer using three.js and some python hackery.

# Visualize
* Install NPM
* Install ws
``` npm install -g local-web-server ```

## Run ws

``` ws ```

## Open Browser
``` http://localhost:8000 ```

## Witness 
The horrible TCP ISN generator for the Synology NAS. I thought ISN generation was no longer an issue? Guess not.

You can also check out the generator for an older Cisco switch also included in the data file.

# Gather
If you want to gather your own sequence numbers to see if your device is vulnerable to ISN attacks, use the _gather.sh_ script, which I grabbed from Michal and ported to OSX.

``` sudo ./gather some-old-hardware.local 80 ```

This will take a while as it is getting 200K ISNs. Like an hour. When it is done tcpdump appears to stay running so go and kill it.

The file ``` sequence_log.txt ``` will have the ISNs.

# Convert

You must convert the ISNs into delayed coordinates so they can be visualized:

``` ./seq_to_coords.py -s sequence_log.txt > coords.csv ```

Finally go change the file access in index.html to point to your new coordinates file and refresh. Have fun!
