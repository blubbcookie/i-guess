import random
import time
import os
def lade_textanimation(*texte, punkte=3, pause=1):
    for text in texte:
        print(text, end="", flush=True)
        for _ in range(punkte):
            time.sleep(pause)
            print(".", end="", flush=True)
        print()
def reaktionstest():
    global username
    lade_textanimation("Achtung")
    time.sleep(random.uniform(0.5,4))
    start = time.time()
    eingabe = input("JETZT")
    if eingabe == "":
        ende = time.time()
        differenz = ende - start
        print(f"deine zeit war {differenz} sekunden")
        save = input(f"willst du den Highscore unter diesem Namen speichern?:{username}(j/n)")
        if save == "j":
            with open("Highscores", "a") as file:
                file.write(f"{username}:{differenz}\n")
        elif save == "n":
            newuser = input("unter welchem Namen denn?")
            with open("benutzername.txt", "w") as f:
                f.write(newuser)
                username = newuser
            with open("Highscores", "a") as file:
                file.write(f"{username}:{differenz}\n")
    else:
        print("das war nicht enter...")
        nochetwas()
def programmende(): 
    print("Bis zum nächsten Mal!")
    exit()
def nochetwas():
    wahl = input("Willst du den Reaktionstest nochmal machen (r) oder das Programm beenden (e)? ").strip().lower()
    if wahl == "r":
        reaktionstest()
    elif wahl == "e":
        programmende()
    else:
        print("Ungültige Eingabe!")
        nochetwas()
def Rankings():
    try:
        with open("Highscores", "r") as f:
            lines = f.readlines()
        scores = []
        for line in lines:
            if ":" in line:
                name, zeit = line.split(":")
                try:
                    zeit = float(zeit)
                    scores.append((zeit, name))
                except ValueError:
                    continue
        scores.sort()
        print("Top 10 Highscores:")
        for i, (zeit, name) in enumerate(scores[:10], 1):
            print(f"{i}. {name} - {zeit:.3f} Sekunden")
    except FileNotFoundError:
        print("Noch keine Highscores vorhanden.")

def menue():
    os.system("cls")
    print("Moin moin")
    print("Die Top Highscores sind im moment:")
    Rankings()
    print("Wusstest du das die durchscnitliche Reaktionszeit etwa 0,2s bis 0,3s beträgt?")
    print("---------------------------")
    print("1. Reaktionstest")
    print("2. Programm beenden")
    while True:
        auswahl = input("Bitte gib 1 oder 2 ein: ")
        if auswahl == "1":
                print("ok mach dich bereit, es wird erst ein drei sekunden timer laufen und danach wird zu einem zufälligme Zeitpunkt dir das signal zum ENTER drücken gegeben")
                bereit = input("bist du bereit?; ja(1)/nein(2)")
                if bereit == "1":reaktionstest()
                elif bereit == "2":menue()
                else:print("Ungültige Eingabe!")
                break
        elif auswahl == "2":
            programmende()
            break
        else:
            print("Ungültige Eingabe!")

# Start des Programms
with open("benutzername.txt", "r") as f:
    username = f.readline()
menue()
