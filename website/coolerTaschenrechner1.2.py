#Programm: coolerTaschenrechner
#Version: 1.2
#Dev:blubbxyz
#changes: titelseiten font, sichern der letzten aktion, quadrateinerzahl, quadratwurzelberechnen, zufallszahlgenerieren, umrechnungen, primzahltest

import random
import os
import math
import time
letztefunktion = None
def header(text):
    print("=" * 180)
    print(text.center(180))
    print("=" * 180)
def lade_wordpool():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(script_dir, "wordpool.txt")
    with open(file_path, "r") as file:
        wordpool = [line.strip() for line in file.readlines()]
    return wordpool
def nochetwas():
    wahl = input("Willst du zurück ins Menü (m),noch mal das was du als letztes getan hast(n) oder das Programm beenden (e)? ").strip().lower()
    if wahl == "m":meunue()
    elif wahl == "n":
        if letztefunktion:
            letztefunktion()
        else:
            print("Keine letzte Funktion gefunden, zurück zum Menü.")
            meunue()
    elif wahl == "e":
        programmende() 
    else:
        print("Ungültige Eingabe!")
        nochetwas()
def programmende():
    print(f"Ja kommd dann mach dich ab du {random.choice(wordpool)} und lass mich in Ruhe arbeiten! Lass dich ja nicht mehr blicken {name}!")
    os.system("cls")
    exit()
def plusrechnung():
    global letztefunktion
    letztefunktion = plusrechnung
    var1 = input("was ist die erste Zahl?")
    var2 = input("was ist die zweite Zahl?")
    print("das ergebnis ist:")
    print("das ergebnis ist:",float(var1) + float(var2))
    nochetwas()
def minusrechnung():
    global letztefunktion
    letztefunktion = minusrechnung
    var1 = input("was ist die erste Zahl?")
    var2 = input("was ist die zweite Zahl?")
    print("das ergebnis ist:")
    print("das ergebnis ist:",float(var1) - float(var2))
    nochetwas()
def malrechnung():
    global letztefunktion
    letztefunktion = malrechnung
    var1 = input("was ist die erste Zahl?")
    var2 = input("was ist die zweite Zahl?")
    print("das ergebnis ist:")
    print("das ergebnis ist:",float(var1) * float(var2))
    nochetwas()
def geteiltrechnung():
    global letztefunktion
    letztefunktion = geteiltrechnung
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
    global letztefunktion
    letztefunktion = zahlenvergleichen
    var1 = float(input("was ist die erste Zahl?"))
    var2 = float(input("was ist die zweite Zahl?"))
    if var1 > var2:
        print(float(var1),"ist größer als",float(var2))
    elif var1 < var2:
        print(float(var1),"ist kleiner als",float(var2))
        nochetwas()
def quadrateinerzahl():
    global letztefunktion
    letztefunktion = quadrateinerzahl
    var1 = float(input(f"mach hinne und sag mir die erste Zahl, die du quadrieren willst du {random.choice(wordpool)}"))
    if  var1 == 0.0: print("du Bastard das ist halt 1 und jetzt piss dich")
    else: print("das quadrat von", var1, "ist:", var1 * var1)
    nochetwas()
def quadratwurzelberechnen():
    global letztefunktion
    letztefunktion = quadratwurzelberechnen
    var1 = float(input("was ist die Zahl, von der du die Quadratwurzel willst?"))
    if var1 < 0:
        print(f"Die Quadratwurzel von negativen Zahlen ist nicht definiert, du {random.choice(wordpool)}")
    else:
        wurzel = math.sqrt(var1)
        print(f"Die Quadratwurzel von {var1} ist: {wurzel}")
    nochetwas()
def zufallszahlgenerieren():
    global letztefunktion
    letztefunktion = zufallszahlgenerieren
    start = int(input("Gib den Startwert ein: "))
    end = int(input("Gib den Endwert ein: "))
    if start >= end:
        print(f"Der Startwert muss kleiner als der Endwert sein, du {random.choice(wordpool)}")
    else:
        zufallszahl = random.randint(start, end)
        print(f"Die Zufallszahl zwischen {start} und {end} ist: {zufallszahl}")
    nochetwas()
def umrechnungen():
    global letztefunktion
    letztefunktion = umrechnungen
    print("Welche Umrechnung möchtest du Gesindel?")
    print("1. Meter zu Zentimeter")
    print("2. Kilometer zu Meter")
    print("3. Celsius zu Fahrenheit")
    print("4. Euro zu Dollar")
    umrechnungenn = {
        "1": lambda: print(f"Das Ergebnis ist: {float(input('Gib die Meter ein: ')) * 100} cm"),
        "2": lambda: print(f"Das Ergebnis ist: {float(input('Gib die Kilometer ein: ')) * 1000} m"),
        "3": lambda: print(f"Das Ergebnis ist: {(float(input('Gib die Celsius ein: ')) * 9/5) + 32} °F"),
        "4": lambda: print(f"Das Ergebnis ist: {float(input('Gib den Euro-Betrag ein: ')) * 1.1} $")  
    }
    while True:
        wahl = input("Wähle eine Umrechnung (1-4): ")
        if wahl in umrechnungenn:
            umrechnungenn[wahl]()
            break
        else:
            print(f"Bist du dumm? Gib eine von diesen ein: 1, 2, 3, 4. Sonst tschüss, du {random.choice(wordpool)}")
    nochetwas()
def primzahltest():
    global letztefunktion
    letztefunktion = primzahltest
    zahl = int(input("Gib eine Zahl ein, die du auf Primzahl testen möchtest: "))
    if zahl < 2:
        print(f"{zahl} ist keine Primzahl, du {random.choice(wordpool)}")
        nochetwas()
    for i in range(2, int(math.sqrt(zahl)) + 1):
        if zahl % i == 0:
            print(f"{zahl} ist keine Primzahl, du {random.choice(wordpool)}")
            nochetwas()
            return
    print(f"{zahl} ist eine Primzahl, du {random.choice(wordpool)}")
    nochetwas()
def meunue(): 
    os.system("cls")
    
    header("""
         ██████╗ ██████╗  ██████╗ ██╗     ███████╗██████╗ ████████╗ █████╗ ███████╗ ██████╗██╗  ██╗███████╗███╗   ██╗██████╗ ███████╗ ██████╗██╗  ██╗███╗   ██╗███████╗██████╗ 
        ██╔════╝██╔═══██╗██╔═══██╗██║     ██╔════╝██╔══██╗╚══██╔══╝██╔══██╗██╔════╝██╔════╝██║  ██║██╔════╝████╗  ██║██╔══██╗██╔════╝██╔════╝██║  ██║████╗  ██║██╔════╝██╔══██╗
        ██║     ██║   ██║██║   ██║██║     █████╗  ██████╔╝   ██║   ███████║███████╗██║     ███████║█████╗  ██╔██╗ ██║██████╔╝█████╗  ██║     ███████║██╔██╗ ██║█████╗  ██████╔╝
        ██║     ██║   ██║██║   ██║██║     ██╔══╝  ██╔══██╗   ██║   ██╔══██║╚════██║██║     ██╔══██║██╔══╝  ██║╚██╗██║██╔══██╗██╔══╝  ██║     ██╔══██║██║╚██╗██║██╔══╝  ██╔══██╗
        ╚██████╗╚██████╔╝╚██████╔╝███████╗███████╗██║  ██║   ██║   ██║  ██║███████║╚██████╗██║  ██║███████╗██║ ╚████║██║  ██║███████╗╚██████╗██║  ██║██║ ╚████║███████╗██║  ██║
        ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝v1.2""")
    print()
    if name == "Leon":print("Ich hab folgende Optionen für dich, Großer:")
    else: print("Ich hab folgende Optionen für dich, Großer:")
    Taskss = ["normale Rechnungen","Zahlen vergleichen","Quadratzahl berechnen","Quadratwurzel berechnen","Zufallszahl generieren","Umrechnungen","Primzahltest","zufällige Beleidigung","Programmende"]
    for nummera, taska in enumerate(Taskss, 1):
        print(f"{nummera}. {taska}")  
    Tasks = {
        float("1"): normalerechnung,
        float("2"): zahlenvergleichen,
        float("3"): quadrateinerzahl,
        float("4"): quadratwurzelberechnen,
        float("5"): zufallszahlgenerieren,
        float("6"): umrechnungen,
        float("7"): primzahltest,
        float("8"): randominsult,
        float("9"): programmende    
    }
    while True:
        operation = float(input("was soll gemacht werden?(gib die Zahl ein)"))
        if operation in Tasks:
            Tasks[operation]()
            break
        else:print(f"Bist du dumm? Gib eine von diesen ein: 1-9 Sonst tschüss, du {random.choice(wordpool)}")
def randominsult():
    global letztefunktion
    letztefunktion = randominsult
    print(f"Du {random.choice(wordpool)}! was ist flasch mitr dir?")
    nochetwas()
wordpool = lade_wordpool()

#START DES PROGRAMM
with open("benutzername.txt", "r") as f:
    name = f.readline()
meunue()
