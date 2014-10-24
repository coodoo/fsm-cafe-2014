
這是模擬家中咖啡機的狀態

# 狀態

	- off
	- warming
	- ready
	- running

# 兩個按鈕

	- power

	- brew

# 實驗目地

	- 想知道在不同狀態時，按下 brew 鈕如何精準的控制
	- 而不需像以往用一堆 if/else

# 結果
	- 目前看來 fsm 能讓事件變單純條理化
	- 只要乖乖找到正確的 state 加上控制式即可
	- 確實比 if/else 好

# 下一步

	- 實驗 head first design patterns 中說的 state pattern

	- 煮到一半沒水了，要等加完水再繼續


# 一帆建議

	- 總結大致上就是由 state 跟 transition 來決定要做什麼事，避免在 UI or I/O events 裡面重複 if/else 確認目前的 state

	- 總結大致上是儘量縮小 variable 的 scope，可以的話用 passing variable 取代 flag



