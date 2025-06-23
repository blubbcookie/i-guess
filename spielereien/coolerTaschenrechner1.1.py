#Programm: coolerTaschenrechner
#Version: 1.1
#Dev:blubbxyz
#changes: kompakter; neue Funktionen Wie Vergleich von Zahlen

import random
import os
Taskss = ["normale Rechnungen" , "Zahlen vergleichen"]
print(Taskss)
def lade_wordpool():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(script_dir, "wordpool.txt")
    with open(file_path, "r") as file:
        wordpool = [line.strip() for line in file.readlines()]
    return wordpool
wordpool = lade_wordpool()
def nochetwas():
    wahl = input("Willst du zurück ins Menü (m) oder das Programm beenden (e)? ").strip().lower()
    if wahl == "m":meunue()
    elif wahl == "e":programmende()
    else:print("Ungültige Eingabe!")
    nochetwas()
def programmende():print(f"Ja kommd dann mach dich ab du {random.choice(wordpool)} und lass mich in Ruhe arbeiten! Lass dich ja nicht mehr blicken {name}!")
def plusrechnung():
    var1 = input("was ist die erste Zahl?")
    var2 = input("was ist die zweite Zahl?")
    print("das ergebnis ist:")
    print("das ergebnis ist:",float(var1) + float(var2))
    nochetwas()
def minusrechnung():
    var1 = input("was ist die erste Zahl?")
    var2 = input("was ist die zweite Zahl?")
    print("das ergebnis ist:")
    print("das ergebnis ist:",float(var1) - float(var2))
    nochetwas()
def malrechnung():
    var1 = input("was ist die erste Zahl?")
    var2 = input("was ist die zweite Zahl?")
    print("das ergebnis ist:")
    print("das ergebnis ist:",float(var1) * float(var2))
    nochetwas()
def geteiltrechnung():
    var1 = input("was ist die erste Zahl?")
    var2 = input("was ist die zweite Zahl?")
    if float(var2) == 0:print(f"Durch 0 teilen geht nicht, du {random.choice(wordpool)} 😄")
    else:print("das ergebnis ist:", float(var1) / float(var2))
    nochetwas()
def normalerechnung():
    operationen = {
        "+": plusrechnung,
        "-": minusrechnung,
        "*": malrechnung,
        "/": geteiltrechnung
    }
    while True:
        rechenzeichen = input("was für eine rechenoperation soll ich durchführen? (+, -, *, /): ")
        if rechenzeichen in operationen:
            operationen[rechenzeichen]()
            break
        else:print(f"Bist du dumm? Gib eine von diesen ein: +, -, *, /. Sonst tschüss, du {random.choice(wordpool)}")
        nochetwas()  
def zahlenvergleichen():
    var1 = float(input("was ist die erste Zahl?"))
    var2 = float(input("was ist die zweite Zahl?"))
    if var1 > var2:
        print(float(var1),"ist größer als",float(var2))
    elif var1 < var2:
        print(float(var1),"ist kleiner als",float(var2))
        nochetwas()
# def quadratwurzelberechnen():
# def zufallszahlgenerieren():
# def umrechnungen():
# def primzahltest():
def meunue(): 
    os.system("cls")
    if name == "Leon":print("Ich hab folgende Optionen für dich, Großer:")
    else: print("Ich hab folgende Optionen für dich, Großer:")
    Taskss = ["normale Rechnungen","Zahlen vergleichen","Quadratwurzel berechnen","Zufallszahl generieren","Umrechnungen","Primzahltest","Programmende"]
    for nummera, taska in enumerate(Taskss, 1):
        print(f"{nummera}. {taska}")  
    Tasks = {
        float("1"): normalerechnung,
        float("2"): zahlenvergleichen,
        # float("3"): quadrateinerzahl,
        # float("4"): quadratwurzelberechnen,
        # float("5"): zufallszahlgenerieren,
        # float("6"): umrechnungen,
        # float("7"): primzahltest,
        float("8"): programmende    
    }
    while True:
        operation = float(input("was soll gemacht werden?(gib die Zahl ein)"))
        if operation in Tasks:
            Tasks[operation]()
            break
        else:print(f"Bist du dumm? Gib eine von diesen ein: 1 , 2 , 8 Sonst tschüss, du {random.choice(wordpool)}")


#START DES PROGRAMMS
print("hello world")
name = input("wie heißt du?")
with open("benutzername.txt", "w") as file:
    file.write(name)
if name == "Leon": print("Moin chef!!")
else: print("poah ne oder?")
meunue()

