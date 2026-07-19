# Unreal Engine — pierwsze kroki

Podczas zajęć poznamy podstawy edytora Unreal Engine i nauczymy się rozmieszczać obiekty na poziomie. Następnie za pomocą Blueprintów stworzymy pierwsze mechaniki: drabinę działającą jak teleport oraz prosty portal. Przy okazji dowiemy się, czym są zdarzenia, nody i zmienne.

## Rozmieszczanie elementów

Podstawowym obiektem, który możemy umieścić na poziomie/scenie, jest **Actor**. Aktorem może być na przykład światło, kamera, drzwi albo portal. 
Elementy dostępne w panelu **Place Actors** możemy przeciągać na scenę. Znajdziemy tam między innymi:

- podstawowe kształty, na przykład sześcian, kulę i walec,
- źródła światła,
- kamery,
- obszary wyzwalające zdarzenia (triggery),
- efekty wizualne i dźwięki.

Po zaznaczeniu obiektu możemy zmieniać jego położenie, obrót i rozmiar. Pomagają w tym skróty:

- `W` — aktywuje tryb przesuwania obiektu,
- `E` — aktywuje tryb obracania obiektu,
- `R` — aktywuje tryb skalowania obiektu,
- `Alt` + przeciągnięcie — utworzenie kopii obiektu,
- `F` — ustawienie widoku na zaznaczonym obiekcie,
- `End` — opuszczenie obiektu na podłoże,
- `Ctrl` + `Z` — cofnięcie ostatniej czynności,
- `Ctrl` + `S` — zapisanie zmian,
- `Delete` — usunięcie zaznaczonego obiektu.

## Podstawy logiki

### Gdzie umieszczamy logikę?

Logikę gry możemy tworzyć za pomocą wizualnego systemu programowania **Blueprint**. Zamiast wpisywać kod, łączymy ze sobą nody, czyli bloczki wykonujące określone zadania.

Logikę umieszczamy w różnych klasach i Blueprintach, zależnie od tego, czego dotyczy:

- **GameMode** — określa zasady rozgrywki, na przykład sposób zdobywania punktów, warunki zwycięstwa oraz domyślne klasy postaci i kontrolera gracza używane na danym poziomie.
- **PlayerController** — odbiera polecenia konkretnego gracza i zarządza obiektem, którym gracz steruje. Może także obsługiwać interfejs użytkownika.
- **Pawn / Character (Default Pawn Class)** — reprezentuje obiekt, którym można sterować. `Character` jest specjalnym rodzajem Pawna przygotowanym do poruszania postacią. Ustawienie **Default Pawn Class** w GameMode wskazuje, jaka postać ma zostać domyślnie utworzona dla gracza.
- **Level Blueprint** — zawiera logikę dotyczącą jednego, konkretnego poziomu, na przykład uruchomienie filmowej sekwencji po wejściu do sali. Nie należy w nim umieszczać mechanik, które chcemy wykorzystywać na wielu poziomach.
- **własny Actor Blueprint**, na przykład `BP_Door` lub `BP_Teleport` — najlepsze miejsce na logikę konkretnego obiektu. Taki Blueprint możemy wielokrotnie umieszczać na scenie.
- **GameInstance** — przechowuje dane potrzebne również po zmianie poziomu, na przykład ustawienia lub informacje o rozpoczętej rozgrywce.

Unreal Engine zaleca używanie prefiksów informujących o rodzaju zasobu. Dzięki temu łatwiej odnaleźć pliki w projekcie:

- `BP_` — Blueprint, na przykład `BP_Door`,
- `WBP_` — Widget Blueprint, na przykład `WBP_MainMenu`,
- `SM_` — Static Mesh, na przykład `SM_Table`,
- `SK_` — Skeletal Mesh, na przykład `SK_Hero`,
- `M_` — materiał, na przykład `M_Wood`,
- `MI_` — instancja materiału, na przykład `MI_Wood_Dark`,
- `T_` — tekstura, na przykład `T_Brick_D`,
- `AC_` — Actor Component, czyli komponent z logiką, który możemy dodawać do obiektów typu Actor.

Więcej przykładów znajduje się w [zaleceniach dotyczących nazewnictwa zasobów](https://dev.epicgames.com/documentation/unreal-engine/recommended-asset-naming-conventions-in-unreal-engine-projects).

### Podstawowe zdarzenia

Unreal Engine udostępnia wiele wbudowanych zdarzeń. Zdarzenie uruchamia fragment logiki, gdy wydarzy się określona sytuacja, na przykład rozpocznie się gra, gracz naciśnie klawisz albo wejdzie w obszar kolizji.

- **Event BeginPlay** — wykonuje się raz, gdy obiekt rozpoczyna działanie w grze. Możemy go użyć do ustawienia wartości początkowych.
- **Event Tick** — wykonuje się w każdej klatce gry, jeśli obsługa Tick jest włączona dla danego obiektu. Korzystamy z niego rozsądnie, ponieważ zbyt wiele operacji wykonywanych co klatkę może spowolnić grę.
- **Event ActorBeginOverlap** — uruchamia się, gdy inny Actor zacznie nachodzić na obszar kolizji obiektu.
- **Event ActorEndOverlap** — uruchamia się, gdy inny Actor opuści obszar kolizji.
- **On Component Begin Overlap** — działa podobnie do `ActorBeginOverlap`, ale dotyczy konkretnego komponentu, na przykład `Box Collision`.
- **Input Action** — reaguje na skonfigurowaną akcję gracza, na przykład skok lub interakcję.
- **Event ActorOnClicked / OnClicked** — uruchamia się po kliknięciu Actora lub jego komponentu, jeśli obsługa kliknięć jest włączona.

### Budowa noda

Pojedynczy bloczek w Blueprintach nazywamy **nodem**. Nody mają piny, za pomocą których łączymy je ze sobą.

Białe piny ze strzałkami tworzą ścieżkę wykonania i określają kolejność uruchamiania nodów. Kolorowe, okrągłe piny służą do przekazywania danych. Piny po lewej stronie zwykle przyjmują dane potrzebne do działania, a piny po prawej zwracają wynik, na przykład obliczoną liczbę lub znaleziony obiekt.

Nie każdy node ma białe piny. Nody, które tylko pobierają wartość albo wykonują obliczenie, mogą działać wtedy, gdy ich wynik jest potrzebny innemu nodowi.

[ktg_assets/img/ktg2_node.png]

## Teleport / drabina

Jako pierwszy przykład stworzymy prostą drabinę działającą jak teleport. Po wejściu gracza w obszar kolizji przeniesiemy go od razu na górę. To prosty sposób obsługi drabin, spotykany w grach, w których wspinanie nie wymaga osobnej animacji i pełnej mechaniki ruchu - jak w Final fantasy 7.

[ktg_assets/img/ktg2_ex1.png]

(rozwijany ue-blueprint-viewer: "BP_Ladder"
Components
- DefaultSceneRoot
-- Arrow
-- CollisionBox
-- LadderMesh

Graphs
- EventGraph [ktg_assets/bp/ktg2_bp_ladder_event_graph.png]

Viewport [ktg_assets/bp/ktg2_bp_ladder_view.png]
)

## Pojemniki na dane — zmienne

Podczas tworzenia gry często musimy zapamiętać jakąś informację, na przykład: „drzwi są otwarte”, „gracz ma pięć jabłek” albo „klucz ma piotrek”. Służą do tego **zmienne** (Variables), czyli nazwane pojemniki na dane.

Nazwa zmiennej powinna jasno informować, co w niej przechowujemy, na przykład `IsDoorOpen` albo `AppleCount`. Każda zmienna ma określony typ, który decyduje o tym, jakie wartości możemy w niej zapisać.

- **Boolean (Bool)** — `True` albo `False`, na przykład informacja, czy drzwi są otwarte.
- **Integer** — liczba całkowita, na przykład liczba zebranych jabłek.
- **Float** — liczba z częścią dziesiętną, na przykład pozostały czas: `12.5` sekundy.
- **String** — ciąg znaków, który możemy modyfikować, na przykład wpisane przez gracza imię.
- **Text** — tekst przeznaczony do wyświetlania graczowi, na przykład treść zadania lub komunikatu.
- **Name** — krótka nazwa lub identyfikator, na przykład nazwa przedmiotu w ekwipunku.
- **Vector** — trzy liczby: `X`, `Y` i `Z`, opisujące na przykład położenie obiektu.
- **Rotator** — obrót w trzech osiach, na przykład kierunek ustawienia portalu.
- **Transform** — położenie, obrót i skala obiektu zapisane razem.
- **Object Reference** — odwołanie do konkretnego obiektu odpowiedniej klasy, na przykład `Actor Object Reference` wskazujące cel portalu.

Jedna zwykła zmienna przechowuje jedną wartość określonego typu. 

(block info W dalszej części kursu poznamy tablice, które mogą przechowywać wiele liste elementow tego samego typu, oraz struktury, dzięki którym połączymy kilka informacji we własny typ danych.)

(block ostrzerzenie Wszystkie nazwy w Unreal Engine w tym nazwy zmiennych nie powinny zawierac polskich znakow - powoduja one problemy w dzialaniu programu.)

## Portal

Portal możemy utworzyć podobnie jak drabinę — zmieniając położenie gracza. Tym razem miejsce docelowe bedzie konfigurowalne.

Najpierw dodajemy do poziomu pustego Actora lub `Target Point` w miejscu, do którego ma trafić gracz. W Blueprincie portalu tworzymy zmienną `DestinationTarget` typu `Actor` i włączamy dla niej ikonę otwartego oka  (**Instance Editable**). Jej wartość możemy ustawić osobno dla każdego portalu umieszczonego na scenie. W panelu **Details** przypisujemy do niej przygotowany obiekt docelowy.

(rozwijany ue-blueprint-viewer: "BP_Portal"
Components
- DefaultSceneRoot
-- Box (Box Collision)
-- Portal (Mesh)

Graphs
- EventGraph [ktg_assets/bp/ktg2_bp_portal_event_graph.png]

Variables
- DestinationTarget {Actor} {public}

Viewport [ktg_assets/bp/ktg2_bp_portal_view.png]
)

(block worning Kiedy gracz wejdzie w obszar portalu, Blueprint sprawdzi za pomocą `Is Valid`, czy wybraliśmy cel - gdybysmy tego nie zrobili dojdzie do bledu.)

(block worning Cel teleportacji umieszczamy poza obszarem kolizji portalu docelowego i na wysokości środka kapsuły postaci. W przeciwnym razie gracz może pojawić się w podłodze albo natychmiast uruchomić kolejny teleport i zacząć przeskakiwać między portalami.)

## Quiz

1. Który klawisz włącza tryb przesuwania obiektu?
2. Czym różni się `Event BeginPlay` od `Event Tick`?
3. Do czego służą białe piny ze strzałkami w nodach?
4. Jakie informacje może przechowywać zmienna typu `Boolean`?
5. Jakiego typu zmiennej użyjemy do zapisania liczby zebranych jabłek?
6. Gdzie najlepiej umieścić logikę drzwi, które chcemy wykorzystać na wielu poziomach?
7. Do czego służy komponent `Box Collision` w naszym portalu?
8. Dlaczego dla zmiennej `DestinationTarget` włączyliśmy opcję **Instance Editable**?
9. Co należy sprawdzić przed przeniesieniem gracza do `DestinationTarget`?
10. Jakim skrótem możemy szybko utworzyć kopię obiektu na scenie?

## Zadanie dla chętnych

**Proste:** Zbuduj prosty teleport podłogowy. Gdy gracz na niego wejdzie, powinien zostać do innego teleportu.

**Trudne:** Przygotuj krótką zagadkę wykorzystującą poznane mechaniki.

## Ciekawe materiały dodatkowe

Materiały pokazują przykłady z gier przeznaczonych dla różnych grup wiekowych. Przed zajęciami prowadzący lub opiekun powinien sprawdzić, czy wybrane filmy są odpowiednie dla uczestników.

- [20 trików w Unreal Engine 5](https://www.youtube.com/watch?v=BZ3B8avY-t4&t=371s)
- [Nie ma to jak DRZWI W GRACH](https://www.youtube.com/watch?v=r_aQnkzYHe8)
- [Najgroźniejszy wróg każdego gracza (drabina)](https://www.youtube.com/watch?v=Lmj2nbaAZK4)
- [Jak działają PORTALE?](https://www.youtube.com/watch?v=XLej4is6Hps)
- [Niemożliwe sztuczki twórców gier](https://www.youtube.com/watch?v=DocgXhYswfM)
