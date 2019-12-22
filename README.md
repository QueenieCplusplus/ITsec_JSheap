# ITsec_JSheap
JavaScript 堆積

記憶體管理

底層的作業系統管理應用程式可用的記憶體，其中說明了實體記憶體並非由應用程式直接存取。作業系統採用虛擬記憶體的概念，強制分離了執行中進程的記憶體，得以讓它們擁有完整線性位置空間的存取權。

每一進程都有各自所屬的記憶體，以便於儲存或是操作資料。記憶體主要區分為 heap & stack，以及存放代碼庫 lib。

# Heap & Stack

* Heap, 堆積

   存放 process 執行過程中的動態配置資料。

* Stack, 堆疊

  主要存放 process 裡函數的區域變數及其資料、中繼資料(連結資料)、函數溢出的暫存器。

# Enhancement

記憶體管理的防禦成為目前資安專家們需要精通的領域，這些包含如下:

* cookies in heap

* ASLR

* DEP

* SafeSEH

# 記憶體分配器

也稱為記憶體分配器，專門負責動態配置 heap 的虛擬記憶體，透過 malloc 函數或是系統其他
同質函數開放給外界使用。許多大型的瀏覽器（也是種應用程式）會自己實作自己的記憶體管理器，具體來說，就是向系統請求一大塊記憶體區域，並以自己的實作方式管理著。

# jemalloc

被很多瀏覽器平台所支援，包含 Andorid、Linux、Os X、Windows 等，jemalloc 將記憶體區分為固定大小的 chunk 區塊，依照不同平台，其 size 不同，可能有 1MB。

jemalloc 使用 chunk 儲存其他資料結構，及使用者請求的記憶體，而為了緩解執行緒之間的競鎖問題，jemalloc 採用 arenas 來管理 chunks。

# chunk splits to runs

一個 run 最多只有 2048 個位元組，一個 run 能追蹤記憶體的可用和已用地區 region，藉由呼叫 malloc 時返回的 heap 項目，則每個 run 關聯一個 bin，bin 負責儲存 run，而且 bin 又關聯一個 size dataType。

             Arena 
             
         arena chunk list \
         arena bin bins[]  \
                            \
               |           arena chunk1 - - -    arena run1 ---------
               |           arena chunk2          arena run2          |
               |                .                                    |
                                .                                    |
           Arena Bin            .                                    V
                           arena chunkN                             Page1 --- region
                                                                    Page2     region 
                                                                    PageN     region
