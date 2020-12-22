//先创建一个空数组，用来存储16个格子的数据
var board = new Array();
//创建score变量用来存储分数
var score = 0;
//在最初完成后，发现了bug：2,2,4，直接合并为了8，
//为了消除bug，特意创建此变量，用来使一个格子发生一次叠加后，在刷新面板前，禁止再次叠加
var hasConflicted = new Array();
//页面加载完成后，开始一个新游戏
$(document).ready(function(){
    newgame();
});

function newgame(){
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

//初始化棋盘格子
function init()
{
    //建立16个棋盘格子
    for(var i = 0; i < 4; i ++)
    {
        for(var j = 0; j <4; j ++)
        {
            var gridCell = $("#grid-cell-"+i+"-"+j);
        //每个格子位置用getPosTop(),getPosLeft()来计算，具体步骤在support.js里
            gridCell.css('top',getPosTop(i,j));
            gridCell.css('left',getPosLeft(i,j));
        }
    }
    //再将用于存储数据的board初始化为4*4的数组
    for(var i = 0 ; i < 4 ; i ++)
    {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for(var j = 0 ; j < 4 ; j ++)
        {
            board[i][j] = 0;
            //此处依然为每个数字没有发生叠加
            hasConflicted[i][j] = false;
        }
    }
    //刷新面板
    updateBoardView();
    //分数设置为0
    score = 0;
}

//刷新面板具体过程
function updateBoardView()
{
    //先移除上一次面板数据
    $(".number-cell").remove();
    //再重新为每个格子插入新数据
    for(var i = 0 ; i < 4 ; i ++)
    {
        for(var j = 0 ; j < 4 ; j ++)
        {
            //首先为整个容器插入4*4的数字块，和格子正好覆盖，并且编好号
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            //将遍历过程中的某个数字块赋值给theNumberCell
            var theNumberCell = $('#number-cell-'+i+'-'+j);
            //如果此数字块的值为0，则此数字块不显示
            if(board[i][j] == 0)
            {
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j) + 50);
                theNumberCell.css('left',getPosLeft(i,j) + 50);
            }
            //若不为0，则显示
            else
            {
                 theNumberCell.css('width', '100px');
                 theNumberCell.css('height', '100px');
                 theNumberCell.css('top', getPosTop(i, j));
                 theNumberCell.css('left', getPosLeft(i, j));
                 theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
                 theNumberCell.css('color',getNumberColor(board[i][j]));
                 theNumberCell.text(board[i][j]);
            }
            //此处依然为每个数字没有发生叠加
            hasConflicted[i][j] = false;
        }
    }
}

//随机生成一个数字的过程
function generateOneNumber()
{
    //如果当前面板没有空余空间可用来生成数字，则退出
    if(nospace(board))
    {
        return false;
    }

    //随机选择一个位置
    var randx = parseInt(Math.floor(Math.random() *4 ));
    var randy = parseInt(Math.floor(Math.random() *4 ));
    var times = 0;
    //此处选择添加一个死循环为了若随机选择的位置已有数字则在随机选择直到找到空位置
    while(times < 50)
    {
        if(board[randx][randy] == 0)
        {
            break;
        }
        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));
        times ++;
    }
    if(times == 50)
    {
        for(var i = 0 ; i < 4 ; i ++)
        {
            for(var j = 0 ; j < 4 ; j ++)
            {
                if(board[i][j] == 0)
                {
                    randx = i;
                    randy = j;
                }
            }
        }
    }

    //随机一个数字2或4
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    //将数字显示出来的过程是一个动画，具体过程在showanimation2048.js
    showNumberWithAnimation(randx,randy,randNumber);
    return true;
}

//按下键盘后开始出发游戏
$(document).keydown(function (event)
{

    //阻止键盘的默认事件，防止出现按上下左右键时网页本身也跟着晃动
    event.preventDefault();
    //根据不同按键出现不同时间
    switch(event.keyCode){
        case 37://left键的键码为37
             //触发了向左移动
            if(moveLeft()){
            //随机产生一个数字
                setTimeout("generateOneNumber()",210);
            //查看是否达到游戏结束条件，如果是，则游戏结束
                setTimeout("isgameover()",300);
            }
            break;
        case 38://up
            if (moveUp()) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 39://right
            if (moveRight()) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 40://down
            if (moveDown()) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        default:
            break;

    }
});
//判断游戏是否结束
function isgameover(){
    //如果已经没有空间可产生新数字并且现有数字无法移动
    if(nospace(board) && nomove(board)){
        gameover();
    }
}

function gameover(){
    //弹出Game Over!
    alert('Game Over!');
}

//向左移动的具体过程
function moveLeft(){
     //首先要判断是否可以向左移动，具体判断过程在support2048.js里
    if(!canMoveLeft(board)){
        return false;
    }

    //moveLeft
    for(var i = 0 ; i < 4 ; i ++){
        for(var j = 1 ; j < 4 ; j ++){
            if(board[i][j] != 0){
                for(var k = 0 ; k < j ; k ++){
                    if(board[i][k] == 0 && noBlockHorizontal(i,k,j,board)){
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][k] = true;

                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight() {
    if (!canMoveRight(board)) {
        return false;
    }

    //moveRight
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0 ; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][k] = true;

                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveUp() {
    if (!canMoveUp(board)) {
        return false;
    }

    //moveUp
    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;

                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveDown() {
    if (!canMoveDown(board)) {
        return false;
    }

    //moveDown
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;

                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}
