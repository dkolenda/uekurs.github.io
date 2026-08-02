# Mechanika cz. 3

Na dzisiejszych zajęciach poznajemy zmienne publiczne, różne sposoby przechowywania danych oraz komunikację między Blueprintami za pomocą Event Dispatcherów. Na koniec wykorzystamy te elementy w prostej zagadce z płytami naciskowymi i przejściem otwieranym po wykonaniu poprawnej sekwencji.

## Zmienne publiczne
[ktg_assets/img/ktg10_ex2.png]

W Unreal Engine zmienną w Blueprintcie możemy ustawić jako publiczną, czyli edytowalną dla konkretnego aktora postawionego już na scenie. Po zaznaczeniu takiego aktora wartość zmiennej pojawia się w panelu **Details** i można ją zmienić bez otwierania Blueprinta.

Dzięki temu jeden Blueprint może działać w wielu wariantach. Przykładowo tworzymy jeden Blueprint drzwi, a nazwę wymaganego klucza ustawiamy jako zmienną publiczną. Po wstawieniu kilku drzwi na scenę każde z nich może wymagać innego klucza: jedne `RedKey`, drugie `BlueKey`, a trzecie `BossKey`. Nie musimy kopiować Blueprinta ani tworzyć osobnej klasy dla każdych drzwi.

Zmienne publiczne przydają się szczególnie wtedy, gdy logika działania obiektu jest taka sama, ale różnią się szczegóły: liczba punktów życia przeciwnika, prędkość platformy, kolor światła, nazwa klucza, tekst na tabliczce albo czas, po którym pułapka ponownie się aktywuje.

## Warianty zmiennych

W Blueprintach zmienna może przechowywać jedną wartość albo większy zestaw danych. Najczęściej spotkamy trzy podstawowe warianty:

- **Single** - zwykła zmienna przechowująca jedną wartość, np. jedną liczbę, jeden tekst, jednego aktora albo jedną wartość `true/false`. Używamy jej, gdy potrzebujemy zapamiętać dokładnie jedną rzecz, np. `DoorIsOpen`, `PlayerHealth` albo `RequiredKeyName`.
- **Array** - lista wielu wartości tego samego typu. Sprawdza się, gdy elementów może być kilka lub kilkadziesiąt, np. lista posiadanych kluczy, lista przeciwników na arenie, lista punktów spawnu albo lista płyt naciskowych w zagadce.
- **Map** - zbiór par `klucz -> wartość`. Mapy używamy wtedy, gdy chcemy szybko znaleźć wartość po jej nazwie lub identyfikatorze, np. `NazwaPrzedmiotu -> Ilość`, `NazwaKlucza -> CzyPosiadany` albo `TypPrzeciwnika -> PunktyZaPokonanie`.

Dobór wariantu zmiennej zależy od pytania, na które ma odpowiadać Blueprint. Jeśli pytamy „czy drzwi są otwarte?”, wystarczy `Single`. Jeśli pytamy „jakie klucze ma gracz?”, lepsza będzie `Array`. Jeśli pytamy „ile sztuk każdego przedmiotu ma gracz?”, wygodniejsza będzie `Map`.

## Listy

Array, czyli lista, pozwala przechowywać wiele wartości jednego typu w jednej zmiennej. To bardzo przydatne np. przy ekwipunku, gdzie chcemy zapisać listę nazw przedmiotów posiadanych przez bohatera.

Elementy na liście mają numery porządkowe, nazywane indeksami. W Unreal Engine indeksowanie zaczyna się od zera:

0: Pierwszy element
1: Drugi element
2: Trzeci element

To oznacza, że pierwszy element listy ma indeks `0`, a nie `1`. Jest to częste źródło pomyłek, dlatego zawsze warto sprawdzić, czy podajemy właściwy numer elementu.

Listy mają wbudowany zestaw przydatnych operacji:

- **Add** - dodaje nowy element na koniec listy.
- **Length** - zwraca liczbę elementów znajdujących się aktualnie na liście.
- **Remove Index** - usuwa element o wybranym indeksie. Po usunięciu elementu kolejne elementy przesuwają się, więc ich indeksy mogą się zmienić.
- **Get** - pobiera element z listy na podstawie indeksu. Węzeł występuje w wersji **copy** i **ref**. Wersja **copy** pobiera kopię wartości, więc późniejsza zmiana tej kopii nie zmienia oryginalnego elementu na liście. Wersja **ref** daje bezpośrednie odwołanie do elementu na liście, więc modyfikacja tej wartości może zmienić zawartość listy.

(blok uwaga: Wersja **ref** bywa użyteczna, ale może powodować trudne do znalezienia błędy. Jeśli dwa eventy pracują na tej samej liście i jeden z nich zmieni element w trakcie działania drugiego, wynik może być zaskakujący. Wersja **copy** jest zwykle bezpieczniejsza i czytelniejsza, choć przy bardzo dużych danych może zużywać więcej pamięci.)

- **For Each Loop** - wykonuje tę samą akcję dla każdego elementu listy, po kolei, od pierwszego do ostatniego. Używamy go np. wtedy, gdy chcemy sprawdzić, czy dany przedmiot znajduje się w ekwipunku, wypisać wszystkie elementy listy na ekranie albo stworzyć grupę przeciwników w kilku punktach spawnu.

Listy są szczególnie wygodne przy zagadkach opartych na kolejności. Możemy mieć jedną listę z poprawną sekwencją płyt naciskowych i drugą listę z tym, co nacisnął gracz. Następnie porównujemy obie listy i sprawdzamy, czy gracz wykonał zadanie poprawnie.

## Komunikacja między Blueprintami - Event Dispatchers
[ktg_assets/img/ktg10_ex3.png]

Event Dispatcher pozwala jednemu Blueprintowi ogłosić, że coś się wydarzyło, a innym Blueprintom zareagować na ten sygnał. Można porównać go do radia: jeden obiekt nadaje komunikat, a inne obiekty, które wcześniej zaczęły nasłuchiwać, wykonują swoje akcje, gdy ten komunikat się pojawi.

Przykład: płyta naciskowa ma Event Dispatcher `OnPressed`. Kiedy gracz na nią wejdzie, płyta wywołuje dispatcher. Drzwi albo osobny Blueprint zarządzający zagadką mogą nasłuchiwać tego zdarzenia i zareagować: zapisać naciśniętą płytę, sprawdzić kolejność albo otworzyć przejście.

Jeden Blueprint może mieć wiele Event Dispatcherów, np. `OnPressed`, `OnReleased`, `OnDoorOpened` i `OnPuzzleSolved`. Może też nasłuchiwać wielu zdarzeń pochodzących od innych obiektów. Dzięki temu obiekty nie muszą stale sprawdzać, co dzieje się w świecie gry. Zamiast tego reagują dopiero wtedy, gdy dostaną konkretny sygnał.

Ważne utrudnienie: aby podpiąć się do Event Dispatchera, zwykle potrzebujemy referencji do konkretnego aktora, którego chcemy nasłuchiwać. Jeśli drzwi mają reagować na płytę naciskową, muszą wiedzieć, o którą płytę chodzi. Taką referencję można np. ustawić jako zmienną publiczną w panelu **Details** albo znaleźć aktora w świecie gry (to bywa kosztowne).

## Zagadka
[ktg_assets/img/ktg10_ex1.gif]

Stworzymy prostą zagadkę. Na podłodze znajdują się trzy płyty naciskowe. Gracz musi nadepnąć na nie we właściwej kolejności, aby otworzyć przejście.

(rozwijany ue-blueprint-viewer: "BP_FloorButton"
Components
- DefaultSceneRoot
-- Cube
--- Box

Graphs
- EventGraph [ktg_assets/bp/ktg10_bp_floorbutton_event_graph.png]

Viewport [ktg_assets/bp/ktg10_bp_floorbutton_view.png]

Variables
- name {Name} {public}
)

(rozwijany ue-blueprint-viewer: "BP_PuzzelMenager"
Components
- DefaultSceneRoot
-- Billboard

Graphs
- EventGraph [ktg_assets/bpktg10_bp_puzzel_menager_event_graph.png]

Viewport [ktg_assets/bp/ktg10_bp_floorbutton_view.png]

Variables
- buttons {Array<BP_FloorButton>} {public}
- pressedButtons {Array<Name>}
- correctButtonsKeyCode {Array<Name>}
- door {Actor} {public}
)

## Quiz

1. Do czego służy zmienna publiczna w Blueprintcie?
2. Kiedy użyć `Array`?
3. Od jakiego indeksu zaczyna się numerowanie elementów w liście?
4. Co robi węzeł `Length` dla listy?
5. Czym różni się `Get (copy)` od `Get (ref)`?
6. Do czego służy `For Each Loop`?
7. Jak działa Event Dispatcher?
8. Dlaczego obiekt nasłuchujący Event Dispatchera zwykle potrzebuje referencji do obiektu nadającego sygnał?
9. kiedy uzyc zwykłej zmiennej `Single`?
10. Podaj roznice miedzy Event Dispatchera a Interface?

## Zadanie

Stwórz drzwi otwierane kluczem.
