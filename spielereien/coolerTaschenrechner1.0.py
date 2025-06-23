#Programm: coolerTaschenrechner
#Version: 1.0
#Dev:blubbyxz

import random
import os
def lade_wordpool():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(script_dir, "wordpool.txt")
    with open(file_path, "r") as file:
        wordpool = [line.strip() for line in file.readlines()]
    return wordpool
def plusrechnung():
    var1 = input("was ist die erste Zahl?")
    var2 = input("was ist die zweite Zahl?")
    print("das ergebnis ist:")
    print("das ergebnis ist:",float(var1) + float(var2))
def minusrechnung():
    var1 = input("was ist die erste Zahl?")
    var2 = input("was ist die zweite Zahl?")
    print("das ergebnis ist:")
    print("das ergebnis ist:",float(var1) - float(var2))
def malrechnung():
    var1 = input("was ist die erste Zahl?")
    var2 = input("was ist die zweite Zahl?")
    print("das ergebnis ist:")
    print("das ergebnis ist:",float(var1) * float(var2))
def geteiltrechnung():
    var1 = input("was ist die erste Zahl?")
    var2 = input("was ist die zweite Zahl?")
    if float(var2) == 0:
        print(f"Durch 0 teilen geht nicht, du {random.choice(wordpool)} 😄")
    else:
        print("das ergebnis ist:", float(var1) / float(var2))

print("hello world")    #start des programms
wordpool = lade_wordpool()
name = input("wie heißt du?")
with open("benutzername.txt", "w") as file:
    file.write(name)
if name == "Leon": print("Moin chef!!")
else: print("poah ne oder?")
rechenzeichen = input("was für eine rechenoperation soll ich durchführen?")
if rechenzeichen == "+" or rechenzeichen == "-" or rechenzeichen == "*" or rechenzeichen == "/":
    if rechenzeichen == "+": plusrechnung()
    if rechenzeichen == "-": minusrechnung()
    if rechenzeichen == "*": malrechnung()
    if rechenzeichen == "/": geteiltrechnung()
else:print(f"bist du dumm? ich brauch eine rechenoperation du {random.choice(wordpool)}")
print("eine von denen:+,-,*,/")
rechenzeichen = input("also nochmal was soll ich machen?")
if rechenzeichen == "+" or rechenzeichen == "-" or rechenzeichen == "*" or rechenzeichen == "/":
    if rechenzeichen == "+" or rechenzeichen == "-" or rechenzeichen == "*" or rechenzeichen == "/":
        if rechenzeichen == "+": plusrechnung()
        if rechenzeichen == "-": minusrechnung()
        if rechenzeichen == "*": malrechnung()
        if rechenzeichen == "/": geteiltrechnung()
else:print(f"Dein ernst?du {random.choice(wordpool)} sollst mir eine rechenoperation geben,kein bock auf dich tschüss")
