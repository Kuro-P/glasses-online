    var imgObj = document.getElementById('preview-pic'); 
    var pArea = document.querySelector(".preview");
    var model = document.getElementById('model');
    /*渲染用户上传的图片*/
    function renderPic(){
        var inputObj = document.getElementById('upload'); 
        inputObj.onchange = function(e){ 
            var pic = inputObj.files[0]; // 获取上传的文件信息
            var reader = new FileReader(); // 创建FileReader对象 
            reader.readAsDataURL(pic); // 编码成Data URL (这一步最为关键) 
            model_click = false;
            reader.onload = function(){ // 监听上传完成 
                var src = reader.result; // 拿到base64的路径 
                calcPicPosition(imgObj,src);   
            };
        };
    }
      /*计算图片位置函数*/
    function calcPicPosition(el,src){
        var uploadImg = new Image();
        uploadImg.src = src;
        uploadImg.onload = function(){
            el.src = src;
            el.onload = function(){
                el.width = Math.min(600,parseInt(uploadImg.width));//避免图片分辨率过大
                el.style.cssText = 'margin-left:'+(pArea.offsetWidth-el.width)/2+'px;'+ 'margin-top:'+(pArea.offsetHeight-el.height)/2+'px;';
            };
        };     
    }
    /*计算自定义光标出现位置*/
    function calcArrowPosition(arow,glas){
        bounding = glas.getBoundingClientRect();
        arow.style.top = glas.offsetTop-60+'px';
        arow.style.left = glas.offsetLeft+(bounding.width-20)+'px';
        arow.style.transformOrigin = '-'+(bounding.width/2-10)+'px '+(bounding.height/2-10)+'px';
    }

    model.onclick = function(){
        calcPicPosition(imgObj,'imgs/model.jpg');
    };
    /*将眼镜渲染到左侧预览区域 */
    function addGlasses(){
        var goods = document.querySelector('.goods');
        var lastNode,lastArrow;
        goods.addEventListener('click',function(e){
            var classArr = e.target.className.split(' ');
            if(classArr.indexOf('glasses')!=-1){
                var glasses = document.createElement('div');
                pArea.appendChild(glasses);
                glasses.style.position = 'absolute';
                glasses.className = classArr[1] + ' adjustment';
                var arrow = document.createElement('div');
                arrow.className = 'arrow';
                pArea.appendChild(arrow);  
                if(lastNode){          
                    glasses.style.top = lastNode.style.top;
                    glasses.style.left = lastNode.style.left;
                    glasses.style.width = lastNode.style.width;
                    glasses.style.height = lastNode.style.height;
                    glasses.style.transformOrigin = lastNode.style.transformOrigin;
                    glasses.style.transform = lastNode.style.transform;
                    arrow.style.transformOrigin = lastArrow.style.transformOrigin;
                    arrow.style.transform = lastArrow.style.transform;
                    pArea.removeChild(lastNode);
                    pArea.removeChild(lastArrow);   
                }else{
                    glasses.style.top = 40 + '%';
                    glasses.style.left = 40 + '%';
                    glasses.style.right = 0 + 'px';
                }
                calcArrowPosition(arrow,glasses);
                var rotate = false;
                var lastY;
                arrow.onmousedown = function(e){
                    rotate = true;
                    lastY = e.pageY;
                };
                arrow.onmousemove = function(e){
                    if(rotate){         
                        //var r = (e.pageX-lastX)/(e.pageY-lastY);
                        //var rotateR = Math.floor(r*180/Math.PI);
                        glasses.style.transform = 'rotate('+(e.pageY - lastY)+'deg)';
                        arrow.style.transform = 'rotate('+(e.pageY - lastY)+'deg)';
                    }               
                };
                arrow.onmouseup = function(){
                    rotate = false;
                };
                arrow.onmouseout = function(){
                    rotate = false;
                };
                lastNode = glasses;
                lastArrow = arrow;
                var isDrag = false;
                var bx,by;
                var bounding;
                glasses.onmousedown = function(e){
                    glasses.className += ' border';
                    bounding = glasses.getBoundingClientRect();//获取新的位置值
                    bx = e.pageX - bounding.left;
                    by = e.pageY - bounding.top;           
                    if(bx < bounding.width-10 && by < bounding.height-10){
                        isDrag = true;     
                    }                 
                };
                pArea.addEventListener('mousemove',function(e){
                    var top,left;
                    if(isDrag == true){
                         top = e.pageY - pArea.getBoundingClientRect().top -by;
                         left = e.pageX - pArea.getBoundingClientRect().left-bx;
                        glasses.style.top = Math.max(0,Math.min(top,pArea.offsetHeight-bounding.height)) + 'px';
                        glasses.style.left = Math.max(0,Math.min(left,pArea.offsetWidth-bounding.width)) + 'px';
                        calcArrowPosition(arrow,glasses);
                    }
                },false);
                glasses.onmouseup = function(e){
                    glasses.className = glasses.className.replace(' border','');
                    isDrag = false;
                    lastNode = this;
                };
            }
        },false);
    }
    
    function generateGlasses(){
        var goodsList = document.querySelector('.goods-list');
        var spans = document.querySelectorAll('.pageGroup span');
        var newUl = document.createElement('ul');
        newUl.className = 'page page_2';
        for(var i=13;i<22;i++){
            var newLi = document.createElement('li');
            newLi.className = 'glasses glasses_'+i;
            newLi.style.backgroundImage = "url('imgs/glasses_"+i+".png')";
            newLi.style.backgroundRepeat = "no-repeat";
            newLi.style.backgroundSize = "contain"; 
            newUl.appendChild(newLi);
        }
        goodsList.appendChild(newUl);
        for(let n=0;n<spans.length;n++){
                spans[n].onclick = function(){
                    for(var i=0;i<spans.length;i++){
                        spans[i].className = spans[i].className.replace(/\s*active/,'');
                    }
                goodsList.style.left = -100*n+'%';
                this.className +=" active"; 
            };
        }
    }
    /*更改图片位置函数*/
    function movePic(){

        var img = document.getElementById('preview-pic'); 
        var horizontal = document.querySelector('.change-left');
        var vertical = document.querySelector('.change-top');
        var hlastValue = horizontal.value;
        var vlastValue = vertical.value;
        horizontal.value = 50;
        vertical.value = 50;
        var ofl = img.offsetLeft;
        var oft = img.offsetTop;
        horizontal.addEventListener('input',function(){
            img.style.marginLeft = ofl +(this.value - 50)*img.width/100 + 'px';
            hlastValue = this.value;
        },false);
        vertical.addEventListener('input',function(){
            img.style.marginTop = oft +(this.value - 50)*img.height/100 + 'px';
            vlastValue = this.value;
        },false);
    }
    window.onload = function(){
        renderPic();
        movePic();
        generateGlasses();
        addGlasses();   
    };


