function hauteur() {
        var divHeight;
        var obj = document.getElementById('container');

        if(obj.offsetHeight)          {divHeight=obj.offsetHeight;}
        else if(obj.style.pixelHeight){divHeight=obj.style.pixelHeight;}

        var obj2 = document.getElementById('aside');
        var obj3 = document.getElementById('content');
        obj2.style.height = divHeight+"px";
        obj3.style.height = divHeight+"px";
      }
