#Programm: coolerTaschenrechner
#Version: 1.2
#Dev:blubbxyz
#changes: titelseiten font, sichern der letzten aktion, quadrateinerzahl, quadratwurzelberechnen, zufallszahlgenerieren, umrechnungen, primzahltest

import time
import os 
import subprocess
import random
ROT = '\033[91m'  # Rot
gelb = '\033[93m'  # Gelb
grün = '\033[92m'  # Grün
türkis = '\033[96m'  # Türkis
blau = '\033[94m'  # Blau
lila = '\033[95m'  # Lila
RESET = '\033[0m'
wiedersehen = ["tschö mit ö","hauen sie rein aber nicht zu tief!","See you later aligator","in a while cocodile","tschüsseldorf","san frantschüssko"]
optionen = ["coolerTaschenrechner","Tic Tac Toe","Reaktionstest","andere Sachen"]
letztesprogramm = None

def lade_textanimation(*texte, punkte=3, pause=0.3):
    for text in texte:
        print(text, end="", flush=True)
        for _ in range(punkte):
            time.sleep(pause)
            print(".", end="", flush=True)
        print()
def clear():
    os.system("cls" if os.name == "nt" else "clear")
def ladebalken(laenge=30, delay=0.07):
    for i in range(laenge + 1):
        gefuellt = "█" * i
        leer = "-" * (laenge - i)
        prozent = int((i / laenge) * 100)
        print(f"\rLade: [{gefuellt}{leer}] {prozent}%", end="", flush=True)
        time.sleep(delay)
    print()  
def header(text, delay=0.05):
    centered = text.center(40)
    for i in range(len(centered)):
        clear()
        print("=" * 40)
        zeile = ""
        for j, buchstabe in enumerate(centered):
            if i == j:
                zeile += ROT + buchstabe + RESET
            else:
                zeile += buchstabe
        print(zeile)
        print("=" * 40)
        time.sleep(delay)
def nochetwas():
    wahl = input("Willst du noch etwas machen? ja(j),nochmal(n),exit(e)").lower()
    if wahl == "j":
        meunue()
    elif wahl == "n":
        if letztesprogramm:
            letztesprogramm()
        else:
            print("Keine letzte Funktion vorhanden.")
            meunue()
    elif wahl == "e":
        print(f"{random.choice(wiedersehen)}", end="", flush=True)
        for _ in range(3):
            time.sleep(0.5)
            print(".", end="", flush=True)
        print()
        os.system("cls")
        exit()
    else:
        print("Ungültige Eingabe! Bitte gib 'j', 'n' oder 'e' ein.")
        nochetwas()
def coolerTaschenrechner():
    global letztesprogramm
    letztesprogramm = coolerTaschenrechner
    lade_textanimation("Lade deinen IQ", "Sammle deine Mathe Noten", "ach du scheiße was tu ich mir hier an", "hole zettel und stift raus")
    time.sleep(3)
    clear()
    print("Willkommen zu Leon's cooler Taschenrechner")
    print("Hier kannst du verschiedene Rechnungen durchführen")
    print("Starte anderes Programm...")
    subprocess.run(["python", "spielereien/coolerTaschenrechner1.2.py"])
    print(f"Das war der coole Taschenrechner, du bist nun zurück im Hauptmenü.")
    nochetwas()
def TicTacToe():
    global letztesprogramm
    letztesprogramm = TicTacToe
    lade_textanimation("Kalibriere dein Gehirn für 3-in-einer-Reihe","Analysiere Gegnerstrategie","Wähle das beste X oder O aus","Lade geheime TicTacToe-Taktiken","Bereite das Spielfeld vor")
    time.sleep(3)
    clear()
    print("Willkommen zu Chat gpt's coolem Tic Tac Toe spiel")
    print("Starte anderes Programm...")
    subprocess.run(["python", "spielereien/TicTacToe.py"])
    print(f"Das war Tic Tac Toe, du bist nun zurück im Hauptmenü.")
    nochetwas()
def reaktionstest():
    global letztesprogramm
    letztesprogramm = reaktionstest
    lade_textanimation("berechne deine Nervenbahnen","öle die Tasten")
    time.sleep(3)
    clear()
    print("Willkommen zu Leon's Reakionstest")
    print("Starte anderes Programm...")
    subprocess.run(["python", "spielereien/reaktionstest.py"])
    print(f"Das war der Reaktionstest, du bist nun zurück im Hauptmenü.")
    nochetwas()
def andereSachen():
        global letztesprogramm
        letztesprogramm = andereSachen
        print(f"hier gibts noch nichts zu sehen", end="", flush=True)
        for _ in range(3):
            time.sleep(0.5)
            print(".", end="", flush=True)
        print()
        os.system("cls")
        meunue()
def meunue(): 
    global letztesprogramm
    os.system("cls")
    clear()
    header("Leon’s Python-Bibliothek")
    for nummera, taska in enumerate(optionen, 1):
        print(f"{nummera}. {taska}")  
    Tasks = {
        int("1"): coolerTaschenrechner,
        int("2"): TicTacToe,
        int("3"): reaktionstest,
        int("4"): andereSachen,
        int("5"): nochetwas
    }
    while True:
        operation = int(input("was soll gemacht werden?(gib die Zahl ein)"))
        if operation in Tasks:
            Tasks[operation]()
            letztesprogramm = Tasks[operation]
            break
        else:print(f"Bist du dumm? Gib eine von diesen ein: {nummera} Sonst tschüss...")
def get_username():
    ordner = os.path.dirname(os.path.abspath(__file__))
    pfad = os.path.join(ordner, "benutzername.txt")
    username = input("Wie heißt du? ")
    with open(pfad, "w") as f:
        f.write(username)
    return username

# Start des Programms
print("hello world")
ladebalken()
username = get_username()
meunue()