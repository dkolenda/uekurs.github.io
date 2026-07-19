# Unreal Engine - animacje

Na tych zajęciach zobaczymy, że animacja w grze to nie tylko bieganie postaci. Możemy poruszać drzwiami, kamerą, rekwizytami, a nawet uruchamiać krótkie scenki jak w filmie. Unreal Engine daje nam do tego kilka wygodnych narzędzi: **Timeline**, **Sequencer** i **Animation Montage**.

## Poruszanie obiektów w czasie

[ktg_assets/img/ktg2_ex2.png]

W Blueprintach możemy użyć noda **Timeline**. To taki mały zegarek dla naszego Blueprinta: odlicza czas i zwraca wartość, na przykład od `0` do `1`. Dzięki temu obiekt nie musi nagle przeskakiwać z miejsca na miejsce. Może poruszać się płynnie, elegancko i bez teatralnego "puff!".

Przy drzwiach Timeline może powoli obracać skrzydło drzwi. Na początku wartość wynosi `0`, więc drzwi są zamknięte. Na końcu wartość wynosi `1`, więc drzwi są otwarte. Blueprint w każdej chwili animacji sprawdza aktualną wartość i ustawia odpowiedni obrót.

(rozwijany ue-blueprint-viewer: "BP_Door"
Components
- DefaultSceneRoot
-- DoorFrame
--- Door
-- EnterCollision

Graphs
- EventGraph [ktg_assets/bp/ktg2_bp_door_event_graph.png]

Viewport [ktg_assets/bp/ktg2_bp_door_view.png]
)

Najważniejszy pomysł jest prosty: **Timeline mówi, jak daleko jesteśmy w animacji**, a Blueprint wykorzystuje tę liczbę do zmiany obiektu. Możemy tak otwierać drzwi, przesuwać platformę, podnosić windę albo zrobić magiczną skrzynię, która otwiera się tak wolno, jakby chciała zbudować napięcie.

## Cutscenki

**Sequencer** to narzędzie do tworzenia krótkich scenek filmowych w Unreal Engine. Działa trochę jak prosty program do montażu filmu: mamy oś czasu, kamery, obiekty i klatki kluczowe. Możemy ustawić, że kamera najpierw patrzy na drzwi, potem drzwi się otwierają, a na końcu w kadr wchodzi postać.

Cutscenka przydaje się, gdy chcemy pokazać ważny moment bez zostawiania wszystkiego graczowi. Na przykład: bohater znajduje tajne przejście, most powoli opada albo wielki przycisk robi bardzo poważne "klik". Tak, przyciski też lubią mieć swoje pięć sekund sławy.

### Jak zrobić prostą cutscenkę

0. Na poczatek mamy na scenie podloge do przemieszczenia (flayingFloor), kamere (CineCameraActor), wyzwalacz gdy zajdzie kolizja (triggerBox)
[ktg_assets/img/ktg2_ex2_secuencer_1.png]
1. W Content Browserze klikamy prawym przyciskiem i wybieramy **Cinematics > Level Sequence**. Dodaj na scene.
[ktg_assets/img/ktg2_ex2_secuencer_2.png]
2. Otwieramy utworzony plik.
3. Dodajemy kamerę albo przeciągamy do Sequencera obiekt ze sceny, na przykład podloge.
[ktg_assets/img/ktg2_ex2_secuencer_3.png]
4. Ustawiamy znacznik czasu na początku i dodajemy pierwszy keyframe.
5. Przesuwamy znacznik czasu dalej, zmieniamy pozycję kamery lub obrót obiektu i dodajemy drugi keyframe.
[ktg_assets/img/ktg2_ex2_secuencer_4.png]
6. Klikamy **Play** i sprawdzamy, czy ruch wygląda dobrze.
7. Jesli chcesz by obiekt zostałna miejscu po animacji, klikamy prawym przyciskiem na oś czasu animacji konkretnego aktora "Properties" -> "When Finish" -> "Keep State"
[ktg_assets/img/ktg2_ex2_secuencer_5.png]

(rozwijany ue-blueprint-viewer: "Level Blueprint"
Graphs
- EventGraph [ktg_assets/bp/ktg3_level_bp.png]
)


## Uruchomienie animacji akcji

Postać w Unreal Engine często składa się z dwóch ważnych części: **modelu** i **szkieletu**. Model to widoczna postać, czyli jej wygląd. Szkielet to ukryte kości, które pozwalają poruszać rękami, nogami, głową i innymi częściami ciała.

**Animacja** to zapis ruchu szkieletu. Może mówić: "podnieś rękę", "zrób krok", "machnij mieczem" albo "pomachaj do gracza". Gdy odtwarzamy animację, Unreal porusza kośćmi postaci zgodnie z przygotowanym ruchem.

**Animation Montage** to specjalny sposób uruchamiania animacji akcji. Przydaje się wtedy, gdy animacja ma wystartować w konkretnym momencie gry, na przykład po kliknięciu przycisku, wejściu w trigger albo podniesieniu przedmiotu. Montage możemy traktować jak krótką playlistę ruchów dla postaci.

(rozwijany ue-blueprint-viewer: "BP_PushBox"
Components
- DefaultSceneRoot
-- Cube
--- Box
--- triggerToMoveBox

Graphs
- EventGraph [ktg_assets/bp/ktg2_bp_pushBox_event_graph.png]

Viewport [ktg_assets/bp/ktg2_bp_pushBox_view.png]
)


## Quiz
(stworz quiz z teresci dzisiejszych zajec)

## Zadanie dla chętnych
Stworz ciasne przejscia przez które może przeciskać się gracz. 
Gdy gracz nim przejdzie niech przejscie się zawali blokując droge powrotną.

## Materiały

https://www.youtube.com/watch?v=OSf3WGQUQsA&list=PLFDyiz8X_3NU&index=9 - 
Jak twórcy gier oszukują w animacjach