# -*- coding: utf-8 -*-

fRead = open("DataVisualizationV2.csv")
tmp = fRead.readline().strip().split(',')
data1 = [line.split(',') for line in fRead.readlines()]
fRead.close()

name = ["视频", "电商", "微信", "游戏", "导航", "小说", "音乐", "新闻", "微博", "邮件"]

data = [[int(line1.strip()) for line1 in line] for line in data1]
user = {}

CT = {}
for i in data:
    user[i[0]] = 0
    if i[11] in CT:
        for j in range(0, len(name)):
            if name[j] in CT[i[11]]:
                CT[i[11]][name[j]] += i[j + 1]
            else:
                print("ErrorCT")
                CT[i[11]][name[j]] = i[j + 1]
    else:
        CT[i[11]] = {}
        for j in range(0, len(name)):
            CT[i[11]][name[j]] = i[j + 1]

CTU = {}
for i in data:
    if i[11] in CTU:
        for j in range(0, len(name)):
            if name[j] in CTU[i[11]]:
                if i[0] in CTU[i[11]][name[j]]:
                    CTU[i[11]][name[j]][i[0]] += i[j + 1]
                else:
                    CTU[i[11]][name[j]][i[0]] = i[j + 1]
            else:
                print("Error!")
                CTU[i[11]][name[j]] = i[j + 1]
    else:
        CTU[i[11]] = {}
        for j in range(0, len(name)):
            CTU[i[11]][name[j]] = {}
            CTU[i[11]][name[j]][i[0]] = i[j + 1]

TC = {}
for i in name:
    TC[i] = {}
    for j in range(1, 6):
        TC[i][j] = 0
for i in data:
    for j in range(0, len(name)):
        TC[name[j]][i[11]] += i[j + 1]

TCU = {}
for i in name:
    TCU[i] = {}
    for j in range(1, 6):
        TCU[i][j] = {}
for i in data:
    for j in range(0, len(name)):
        TCU[name[j]][i[11]][i[0]] = i[j + 1]

# ----------Write the CSV----------
fWrite = open("CT.csv", "w")
for i in range(1, 6):
    for j in name:
        fWrite.writelines("小区" + str(i) + "-" + j + "," + str(CT[i][j]) + "\r\n")
fWrite.close()

fWrite = open("CTU.csv", "w")
for i in range(1, 6):
    for j in name:
        for k in CTU[i][j].keys():
            fWrite.writelines("小区" + str(i) + "-" + j + "-" + str(k) + "," + str(CTU[i][j][k]) + "\r\n")
fWrite.close()

fWrite = open("TC.csv", "w")
for i in name:
    for j in range(1, 6):
        fWrite.writelines(i + "-小区" + str(j) + "," + str(TC[i][j]) + "\r\n")
fWrite.close()

fWrite = open("TCU.csv", "w")
for i in name:
    for j in range(1, 6):
        for k in TCU[i][j].keys():
            fWrite.writelines(i + "-小区" + str(j) + "-" + str(k) + "," + str(TCU[i][j][k]) + "\r\n")
fWrite.close()

# ---------Write the Colors----------
cc = ["DE783B", "7B615C", "5687D1", "A173D1", "325EA1", "06367D", "F55877", "3EE5F5", "FFEDAB", "FFE6D1",
      "CAEBC2", "96D581", "73BF40", "339947", "3A6B24"]

fWrite = open("Color.txt", "w")
for i in range(0, len(name)):
    fWrite.writelines('  "' + name[i] + '": "#' + cc[i] + '",\r\n')
for i in range(0, 5):
    fWrite.writelines('  "小区' + str(i + 1) + '": "#' + cc[i + len(name)] + '",\r\n')
for i in user.keys():
    fWrite.writelines('  "' + str(i) + '": "#BBBBBB",\r\n')
fWrite.close()

