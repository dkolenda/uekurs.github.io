# Optymalizacja cz. 1

Na dzisiejszych zajęciach uczymy się, jak wykrywać błędy w Blueprintach (Print String, Breakpoint, Draw Debug), jak sprawdzać zależności i rozmiar assetów za pomocą Reference View i Size Map oraz czym są zasady SOLID i funkcje. Na koniec poznajemy trzy sposoby komunikacji między aktorami — interface, Event Dispatcher i Event Subsystem — które pomagają pisać Blueprinty mniej zależne od siebie nawzajem.

## Wykrywanie błędów
[ktg_assets/img/ktg8_ex0.png]
Wykrywać błędy w naszym programie możemy na kilka sposobów.

**Print String** wypisuje na ekranie tekst albo wartość zmiennej w trakcie działania gry. To najszybszy sposób, żeby sprawdzić, czy dany fragment Blueprinta w ogóle się wykonuje i jaką wartość ma w danym momencie wybrana zmienna.
[ktg_assets/img/ktg8_ex5.png]

**Breakpoint** zatrzymuje wykonywanie Blueprinta w wybranym miejscu. Dzięki temu możemy przejść przez kod krok po kroku (Step Over, Step Into) i podejrzeć aktualne wartości wszystkich zmiennych, zamiast zgadywać, co się dzieje w środku.

**Draw Debug** (np. Draw Debug Line, Draw Debug Sphere) rysuje kształty bezpośrednio w świecie gry. Liniami, kulami albo pudełkami możemy pokazać zasięg ataku, kierunek trace'a albo miejsce trafienia.
[ktg_assets/img/ktg8_ex6.png]

(blok ciekawostka: Węzły debugujące mają zaznaczone pole **Development Only** — dzięki temu automatycznie znikają z finalnej (Shipping) wersji gry i nie obciążają wydajności. Jeśli chcemy uruchamiać Print String co klatkę (np. wewnątrz Tick), warto opakować go w węzeł **Do Once**, żeby nie zalać ekranu tą samą wiadomością.
[ktg_assets/img/ktg8_ex7.png]
)

## Reference View i Size Map
[ktg_assets/img/ktg8_ex4.png]

Reference View pokazuje zależności między assetami w projekcie. Dzięki niemu możemy sprawdzić, które obiekty korzystają z wybranego Blueprinta oraz jakie inne assety są potrzebne do jego działania.
[ktg_assets/img/ktg8_ex3.png]
W przykładzie widać, że `BP_TopDownCharacter` jest potrzebny do działania `BP_Field`. To może sprawiać problemy, jeśli w grze pojawi się kilka typów bohaterów albo gdy będziemy chcieli użyć `BP_Field` ponownie w innym projekcie.

Size Map pokazuje, ile miejsca zajmuje wybrany asset razem z elementami, które są z nim powiązane. To przydatne narzędzie, gdy chcemy sprawdzić, dlaczego pozornie prosty Blueprint robi się ciężki dla pamięci lub dysku.
[ktg_assets/img/ktg8_ex1.png]
[ktg_assets/img/ktg8_ex2.png]
Na przykładzie widać, że dużą część rozmiaru na dysku i w pamięci zajmuje `BP_TopDownCharacter`. Wynika to między innymi z użycia `Cast To`, które tworzy mocną zależność od konkretnej klasy; przy większych projektach taka praktyka utrudnia ponowne użycie Blueprintów i może niepotrzebnie ładować dodatkowe zasoby.

## SOLID

SOLID to pięć zasad, które pomagają pisać kod (i budować Blueprinty) tak, żeby łatwo było go później zmieniać, naprawiać i używać ponownie w innych miejscach. Nazwa pochodzi od pierwszych liter angielskich nazw tych zasad. Poniżej uproszczone, kursowe wyjaśnienie każdej z nich:

- **S — Single Responsibility** (zasada pojedynczej odpowiedzialności): każdy Blueprint albo funkcja powinny robić jedną rzecz i robić ją dobrze.
- **O — Open/Closed** (zasada otwarte-zamknięte): powinniśmy móc dodawać nowe zachowania bez przerabiania istniejącego, działającego kodu.
- **L — Liskov Substitution** (zasada podstawienia Barbary Liskov): Gdy tworzymy nową klase z jakiejś bazowej (dziedziczymy) np. z Actor to ona powinna poprawnie działać wszędzie tam gdzie program spodziewa się klasy bazowej (np. Actor).
- **I — Interface Segregation** (zasada segregacji interfejsów): lepiej mieć kilka małych, konkretnych interfejsów niż jeden ogromny, który wymusza implementowanie zbędnych funkcji.
- **D — Dependency Inversion** (zasada odwrócenia zależności): lepiej polegać na ogólnym kontrakcie (np. interface) niż na konkretnej klasie.

W Unreal Engine widzieliśmy już, co się dzieje, gdy tych zasad nie stosujemy: `BP_Field` przez `Cast To` mocno zależy od `BP_TopDownCharacter`, więc trudno go użyć bez tej konkretnej postaci. SOLID podpowiada, żeby taką zależność zastąpić czymś bardziej ogólnym — właśnie do tego służą **interface**, **Event Dispatcher** i **Event Subsystem**, które poznamy w dalszej części lekcji.

## Funkcje

Funkcja to nazwany fragment kodu, który wykonuje jedno konkretne zadanie i można go wywołać w wielu miejscach, zamiast za każdym razem przepisywać te same node'y od nowa. Dzięki temu Blueprint jest krótszy, łatwiejszy do czytania, a gdy coś trzeba poprawić — wystarczy zmienić kod w jednym miejscu, wewnątrz funkcji, zamiast szukać wszystkich kopii.

Dobra nazwa funkcji (np. `OpenDoor`, `TakeDamage`) mówi od razu, co ona robi — dzięki temu inni (i my sami po kilku tygodniach) szybciej zrozumieją Blueprint bez zaglądania w jego środek.

Funkcje mogą mieć własne **zmienne lokalne** — istnieją tylko na czas wykonywania funkcji i nie są widoczne poza nią, dzięki czemu nie zaśmiecają zmiennych całego Blueprinta.

## Komunikacja między Aktorami

W Unreal Engine mamy trzy popularne sposoby komunikacji między aktorami: przez **interface**, **Event Dispatcher** i **Event Subsystem**.

**Interface** działa jak wspólna umowa. Aktor może wywołać funkcję na innym obiekcie, jeśli ten obiekt implementuje dany interface, bez potrzeby robienia `Cast To` do konkretnej klasy. To dobre rozwiązanie do interakcji typu: użyj, podnieś, otwórz, zadaj obrażenia.
[ktg/ktg_assets/img/ktg8_ex8.png]

Stworze interface o nazwie `BPI_GardeningCertificate` taktujmy to jak certyfikat ukonczenia jakiegoś kursu, każdy aktor który posiada ten interfejs tak jak by miał dokument potwierdzajacy że umie coś zrobić. 
W tym przypadku do `BPI_GardeningCertificate` dodajemy funkcje `OnFieldInteract` - tu nie ma zachowania tej funkcji to tylko lista funkcji jakie musi posiadac aktor który chwali się że ma ten interface.

Przypiszemy w `BP_TopDownCharacter` w `class settings` interface `BPI_GardeningCertificate`
[ktg/ktg_assets/img/ktg8_ex9.png]

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
- EventGraph [ktg_assets/bp/ktg8_bp_field_event_graph.png]

Viewport [ktg_assets/bp/ktg8_bp_field_view.png]
)
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
- EventGraph [ktg_assets/bp/ktg8_bp_field_event_graph.png]

Function
- equip [ktg/ktg_assets/bp/ktg8_bp_top_down_character_equip.png]
- unequip [ktg/ktg_assets/bp/ktg8_bp_top_down_character_unequip.png]

Viewport [ktg_assets/bp/ktg6_bp_top_down_character_view.png]
)

Niezmieniając zachowania zmniejszylismy znacznie `BP_Field` nie zwiekszajac `BP_TopDownCharacter`
[ktg/ktg_assets/img/ktg8_ex10.png]

**Event Dispatcher** działa jak sygnał, do którego inne obiekty mogą się podpiąć. Jeden aktor ogłasza, że coś się wydarzyło, a wszystkie obiekty zapisane do tego eventu mogą zareagować. Przydaje się np. przy przyciskach, drzwiach, UI albo sytuacjach, gdy nadawca nie powinien wiedzieć, kto go słucha.


**Event Subsystem** to centralne miejsce do wysyłania i odbierania zdarzeń w większym systemie gry. Aktorzy komunikują się przez subsystem, zamiast trzymać bezpośrednie referencje do siebie. To wygodne przy bardziej rozbudowanych projektach, ale wymaga przygotowania własnej implementacji w C++.


# Quiz
(stworz quiz z tej lekcji)

# Zadanie
Rozszerz nasz certyfikat ogrodnika o dodatkowe umiejetnosci