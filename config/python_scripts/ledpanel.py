
import socket
import csv
import time
import requests
import sys
from io import StringIO
import os

UDP_IP = '#WLED_LOCAL_IP#'
UDP_PORT = 21324

def display(filename):
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    r = requests.get(filename)
    waitingTime = 1
    repeit = 99
    loop_idx = 0
    col_counter = 0
    while loop_idx < repeit:
        # print(loop_idx)
        loop_idx += 1
        f = StringIO(r.content.decode('ascii'))
        csv_reader = csv.reader(f, delimiter=',')
        row_counter = 0
        col_counter = 0
        for row in csv_reader:

            if row_counter == 0:
                row_counter = 1 
                waitingTime = float(row[0])
                # print('waitingTime:'+ row[0] )
                repeit = float(row[1])
                # print('repeit:'+ row[1] )
            else :
                col_counter = 0
                m = []
                m.append(2)
                m.append(255)

                for col in row: 
                    if col != '':
                        m.append(int(col.split(':')[0]) if col.split(':')[0] != '' else 0)  # Pixel red value
                        m.append(int(col.split(':')[1]) if col.split(':')[1] != '' else 0)  # Pixel green value
                        m.append(int(col.split(':')[2]) if col.split(':')[2] != '' else 0)  # Pixel blue value
                        col_counter += 1
                m = bytes(m)
                sock.sendto(m, (UDP_IP, UDP_PORT))
                time.sleep(waitingTime)
            time.sleep(waitingTime)

    time.sleep(waitingTime)
    m = []
    m.append(2)
    m.append(255)
    col = 0
    while col < col_counter:
        col += 1
        m.append(0)
        m.append(0)
        m.append(0)
    m = bytes(m)
    sock.sendto(m, (UDP_IP, UDP_PORT))


host = 'https://#YOUR_HOSTNAME#.duckdns.org/local/display_animation/'
if os.path.exists('/config/python_scripts/ledpanel') == False:
    open("/config/python_scripts/ledpanel", "w").close()
    if len(sys.argv) > 1:
        display(host+sys.argv[1]+'.csv')
    os.remove("/config/python_scripts/ledpanel")
else:
    print('Animation already running')
