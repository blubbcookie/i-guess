def print_board(board):
    print("\n")
    for row in board:
        print(" | ".join(row))
        print("-" * 10)
    print("\n")

def check_winner(board, player):
    # Zeilen und Spalten
    for i in range(3):
        if all(field == player for field in board[i]) or all(board[j][i] == player for j in range(3)):
            return True
    # Diagonalen
    if all(board[i][i] == player for i in range(3)) or all(board[i][2-i] == player for i in range(3)):
        return True
    return False

def is_draw(board):
    return all(cell in ['X', 'O'] for row in board for cell in row)

def get_move(player, board):
    while True:
        try:
            move = input(f"Spieler {player}, gib deine Position ein (1–9): ")
            pos = int(move) - 1
            if pos < 0 or pos > 8:
                print("Bitte gib eine Zahl von 1 bis 9 ein.")
                continue
            row, col = divmod(pos, 3)
            if board[row][col] in ['X', 'O']:
                print("Dieses Feld ist schon belegt.")
                continue
            return row, col
        except ValueError:
            print("Ungültige Eingabe. Bitte gib eine Zahl ein.")

def tiktaktoe():
    board = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"]]
    current_player = "X"
    print_board(board)

    while True:
        row, col = get_move(current_player, board)
        board[row][col] = current_player
        print_board(board)

        if check_winner(board, current_player):
            print(f"🎉 Spieler {current_player} hat gewonnen!")
            break
        elif is_draw(board):
            print("🤝 Unentschieden!")
            break

        current_player = "O" if current_player == "X" else "X"

# Spiel starten
tiktaktoe()
