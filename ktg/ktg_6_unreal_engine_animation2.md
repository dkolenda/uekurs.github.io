# Unreal Engine Animacje cz. 2

(streszczenie)

# Metahuman
(czym jest metahuman)
[ktg_assets/img/ktg6_ex11.png]

Metahuman pozwala wybrac kilka gotowych postaci i zaporzyczac ich elemennty wygladu do naszej postaci. 
[ktg_assets/img/ktg6_ex12.png]

# Tworzenie własnej animacji

Od wersji 5.8 unreal engine udostepnia możliwość tworzenia animacji dla humanoidalnych Pawn za pomocą nagrań.
[ktg_assets/img/ktg6_ex0.png]
(blok info: Wystarczy proste nagranie telefonem/kamera internetową)

(rozwijany blok 
[ktg_assets/img/ktg6_ex1.png]
Zainstaluj wtyczki dla metahuman

[ktg_assets/img/ktg6_ex2.png]
Otwieramy Live link hub

[ktg_assets/img/ktg6_ex3.png]
1. Ustaw Capture Managment, 2. dodaj Mono Video Ingest. 3.Ustaw katalog gdzie trzymasz nagrania (Take Directory). 4. Wybierz wideo, 5. dodaj do kolejki przetworzenia 7. uruchom kolejke. 
[ktg_assets/img/ktg6_ex4.png]
W kapture manager.
[ktg_assets/img/ktg6_ex5.png]
W kardzym katalogu utworz Metahuman performance
[ktg_assets/img/ktg6_ex6.png]
Ustaw wygenerowany Capture Data w Footage CaptureData, zaznacz "body tracking" w "Virtualization Object" ustaw stworzonego metahuman (jesli nie masz to utwórz), wcisnij proccess gdy skonczy export animation. Na yworzony w ten sposub plik ppm retarget animation wybiersz nasz szkielet np. SKM_Quine_Simple
)

(blok ciekawostka: [ktg_assets/img/ktg6_pp_animation.jpg]
Temat nie jest nowy juz Prince of Persia z 1989 (rotoskopii) oraz L.A. Noire z 2011 (MotionScan) wykorzystywał podobne techniki ale były one bardziej skomplikowane wymagały skomplikowanego sprzetu lub wielu godzin pracy)



# Szkielet

(wyjasnij lekko dzieciom co to jest szkielet do czego slurzy)
[ktg_assets/img/ktg6_ex9.png]
Skielet naszej postaci mozemy znalesc otwierajac nasz character i zagladajac w "Skeletal Mesh Asset"
[ktg_assets/img/ktg6_ex7.png]
(wyjasnij lekko dzieciom co to jest socket w szkielecie - punkt do przypinania przedmiotow; slot to osobne pojecie od Animation Montage)

# Podlewanie grzadki

Gdy wejdziemy na pole włożymy w dłoń characteru konewke i uruchomimi animacje podlewania

[ktg_assets/img/ktg6_ex8.png]

(rozwijany ue-blueprint-viewer: "BP_Field"
Components
- DefaultSceneRoot
-- Cube (Mesh) 
--- Box (Box Collision)
--- plant1 (Mesh)
--- plant2 (Mesh)
--- plant3 (Mesh)
--- plant4 (Mesh)

Graphs
- EventGraph [ktg_assets/bp/ktg6_bp_field_event_graph.png]

Viewport [ktg_assets/bp/ktg6_bp_field_view.png]
)

# Urzyznienie ziemi

Stworzymy akcje na 'E' która uruchomi animacje kopania szpadlem (aby uproscic przyklad bez spawnowania szpadla) w połowie animacji pod nogami gracza stworzymy pole.

Monatrz pozwala nam wyslac do Blueprint notyfikacje w wybranym miejsc animacji - mozna tak wykonac np. combo atakow lub ustawić okno niesmiertelnosci podczas uniku.
[ktg_assets/img/ktg6_ex10.png]

Gdy animacja dojdzie do wyznaczonego punktu uruchomi OnNotifyBegin w play Montage a w NotifyName znajdziesz nazwe notyfikacji (by je rozrozniac gdy jest ich wiecej)

(rozwijany ue-blueprint-viewer: "BP_TopDownCharacter"
Components
- DefaultSceneRoot
-- Capsule Component
--- Arrow Component
--- Mesh
--- SpringArm
---- Camera
- Character Movment

Graphs
- EventGraph [ktg_assets/bp/ktg6_bp_top_down_character_event_graph.png]

Viewport [ktg_assets/bp/ktg6_bp_top_down_character_view.png]
)

(block warning: Nasluchiwanie poprostu na E nie jest najbardziej optymalne rozwiazanie - np. nie pozwala graczowi pzniej zmienic sterowania. Jak bardziej elegancko mapowac przyciski zobaczymy na kolejnych lekcjach)


# Quiz
(stworz quiz do tych zajec)

# Zadanie
Dodaj szpadel do przykladu "Urzyznienie ziemi" - nie poddawaj się gdy pojawi się frustracja, trzymam za Ciebie kciuki.

# Materiały

https://www.youtube.com/watch?v=OZrDng6lce0 Animacje, które działają lepiej niż god mode

https://www.youtube.com/watch?v=OSf3WGQUQsA&t=12s Jak twórcy gier oszukują w animacjach

https://www.youtube.com/watch?v=laJNz1-PBqw Animowanie twarzy w grach wideo

https://www.youtube.com/watch?v=3XUhmIguRxg  L.A. Noire - animacja twarzy jako glowna mechanika
(Komentarz: umieszczam ten material bo gra jest 18+ wiec uczniowie w  nią nie zagraja a koncept gry jest tak unikalny ze uczniowie powinni o nim wiedziec. Material nie zawiera zadnych brutalnych scen)

https://youtu.be/ebHiat0uJOw?si=qH_fv4eSDuLCVkIj&t=295 Animacje AI w Arc Raiders
