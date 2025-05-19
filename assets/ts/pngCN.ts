
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    //空白块位置
   kbx :number = 0;
   kby :number = 0;
   idx :number = -1;

    @property(cc.Prefab)
    fab :cc.Prefab = null;

    



    // onLoad () {}

    start () {
        //定义数组存图片
        var array:number[] = new Array;
        //给原始数组original赋值
        var i :number;

        for(i= 1;i <= 9;i++) {
            array[i] = i;
        }


        // 打乱数组顺序
        array.sort(function() { return 0.5 - Math.random(); });
       
        

        //两层循环随机添加图片
        let p = 0;
        for(i = 1;i<=3;i++){
            for(let j = 1;j<=3;j++){
                //实例化预制体
            let nd = cc.instantiate(this.fab);
            nd.setParent(this.node);
            nd.setPosition(263*(i-1),-263*(j-1));

            //ID对应图片
            nd.getComponent("fb").ID = array[p];
            //cc.log(nd.getComponent("fb").ID);
            //动态加载图片
            cc.loader.loadRes(array[p]+"",cc.SpriteFrame,function(err,s){
                nd.getComponent(cc.Sprite).spriteFrame = s;
            })

            //空白图片
            if(array[p] == 9){
                //更新空白图片索引
                this.idx = p;
                //设置透明度为0；
                nd.opacity = 0;
                //设置碰撞ID为1
                nd.getComponent(cc.PolygonCollider).tag = 1;
                //更新x,y
                this.kbx = nd.x;
                this.kby = nd.y;

            }
            p++;
            }
            
           
                
            }


            //拼图的所有子节点
            let charr = this.node.children;
            for(let ch of charr){
                //非空白块
                if(!(ch.getComponent(cc.PolygonCollider).tag == 1)){
                    //添加触摸点击事件
                    ch.on(cc.Node.EventType.TOUCH_START,(event)=>{
                        //在空白块四周的方块
                        if(/*true*/(ch.x == this.kbx && Math.abs(ch.y-this.kby) <300)||(ch.y == this.kby && Math.abs(ch.x-this.kbx) <300)){
                          //交换图片位置  
                        let tmpx = ch.x;
                        let tmpy = ch.y;
                        ch.setPosition(this.kbx,this.kby);
                        this.kbx = tmpx;
                        this.kby = tmpy;
                        
                        //获取要移动图片索引
                        let a = this.getIndex(array,ch.getComponent("fb").ID)
                        //与空白块交换索引
                        array[this.idx] = array[a];
                        this.idx = a;
                        array[a] = 9;
                        //this.sout(array);


                        //拼完
                        if(this.isWIN(array)){
                            //cc.log("拼完");
                            //停止时间
                           cc.find("label").getComponent("time").time = -999;
                            //切换场景
                            cc.director.loadScene("Win");
                        }
                        
                        }  
                    })
                }
                
            }
        }

        //拼完的判断
        isWIN(arr :number[] ){
            if(arr[0] == 1 && arr[1] == 4 && arr[2] == 7 && arr[3] ==2  && arr[4] == 5 && arr[5] == 8 &&
                arr[6] == 3 && arr[7] == 6 && arr[8] == 9 
            ){
                return true;
            }else{
                return false;
            }
        }
         //数组根据值返回下标
        getIndex(arr :number[],v:number){
            for(let i = 0;i<arr.length;i++){
                if(arr[i] == v){
                    return i;
                }
            }
            return -1;

        }

        //遍历数组
        sout(arr :number[]){
            for(let i = 0;i<arr.length;i++){
                cc.log(arr[i]);
                }

        }


     update (dt) {
        if(cc.find("label").getComponent("time").time == -1){
            cc.director.loadScene("End");
        }

     }


            
 }

    