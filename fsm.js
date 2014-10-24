
/**
 * off
 * warming
 * ready
 * running
 */
var fsm = StateMachine.create({
  
  // 初始 state
  initial: 'Off',

  error: function(eventName, from, to, args, errorCode, errorMessage) {
  	var msg = 'event ' + eventName + ' was naughty :- ' + errorMessage;
  	console.error( msg );
  	return msg;
  },

  //
  events: [
    { name: 'turnOn',	from: 'Off',  		to: 'Warming' },
    { name: 'prepare',	from: 'Warming', 	to: 'Standby'    },
    { name: 'getReady',	from: 'Standby', 	to: 'Ready'    },
    { name: 'brew',  	from: 'Ready',    	to: 'Running' },
    { name: 'done', 	from: 'Running', 	to: 'Standby'  },
    { name: 'turnOff', 	from: '*', 			to: 'Off'  }
]});

// catch all
fsm.onbeforeevent = function(evt, from, to){
	// console.log( '\n#event: ', evt, ' > ', from, ' → ', to );
}

// catch all
fsm.onenterstate = function(evt, from, to){
	// console.log( '#state: ', evt,  ' > ', from, ' → ', to );
}

// 關機前的善後工作
fsm.onbeforeturnOff = function(){
	$btnBrew.off();
}

/**
 * 
 */
fsm.onenterWarming = function(evt, from, to){
	
	// 如果還在熱機時，用戶就按下 brew 鈕
	// 則等到熱機完後，通過 standBy 檢查，就要立即開始煮咖啡，
	var runWhenReady = false;
	
	// 偵聽 ui 事件	
	$btnBrew.on('click', function(){
		if(fsm.is('Ready')){
			// 如果咖啡機已預熱完成，就開始煮
			fsm.brew();
		}else{
			// 不然就要等它預熱完才能開始煮
			console.log( '\tBrew clicked while still warming, will queue it up' );
			runWhenReady = true;
		}
	})

	// callback hell
	doWarmUp( function(){
		fsm.prepare( runWhenReady );
	} );
}

/**
 * 離開狀態時就解掉 btn 偵聽
 */
fsm.onleaveWarming = function(evt, from, to){
	$btnBrew.off();
}

//
fsm.onenterStandby = function(evt, from, to, runWhenReady){

	// 如果水量足，也裝了 capsule，就可進入 ready 狀態
	if( checkWaterAmount() && checkCapsule() ){
		console.log( '\twater ok, capsule loaded, good to go.' );
		fsm.getReady(runWhenReady);
	}else{
		console.log( '\tPlease add water and/or capsule' );
	}
}


// 進入 ready 狀態
fsm.onenterReady = function( evt, from, to, runWhenReady ){
	

	// 模擬綠燈亮
	console.log( '\n\tgreen light ON > runWhenReady: ', runWhenReady );

	if( runWhenReady == true ){
		// 要切換至另個狀態，因此直接 return 跳出
		// 不然下面跑到 .on() 又會掛上一次 click 偵聽
		return fsm.brew();
	}else{
		console.log( '\tMachine ready' );
	}

	// 偵聽 brew button 被按下
	$btnBrew.on('click', function(){
		console.log( '\tbrew click >state: ', fsm.current );
		fsm.brew();
	});

}

// 離開 ready 狀態
fsm.onleaveReady = function(){
	$btnBrew.off();
}


/**
 * 
 */
fsm.onenterRunning = function(){
	
	var str = '';
	var id;
	
	id = setInterval( function(){
		str += '.';
		console.log( 'brewing: ', str );
		
		if(str.length > 5){
			clearInterval(id);
			str = '';

			fsm.done();

			console.log( '\tCafe ready, enjoy!' );
		}
	}, 200);
}


/**
 * 
 */
fsm.onleaveRunning = function(){
	//
}




//========================================================================
//
// ui stuff

// 
var machineStatus = {
	waterAmount: 20,	// 目前水位
	capsuleLoaded: true // 是否有裝 capsule
}

var $btnPower = $('#btnPower');
var $btnBrew = $('#btnBrew');

// 按下 power 鈕就開機，也就是從 off → warming
$btnPower.on('click', function(){
	
	console.log( '\n\npower btn: ', fsm.current );

	// 只要操作這支，就會切換狀態從 off → warming
	if( fsm.is('Off') ){
		fsm.turnOn();
	}else{
		fsm.turnOff();
	}
})


//========================================================================
//
// internals

//
function doWarmUp( cb ){
	console.log( '\tstart warming up' );
	
	setTimeout(function(){
		console.log( '\tend warming up' );
		cb();
	}, 2000);
}

//
function checkWaterAmount(){
	return machineStatus.waterAmount > 5;
}

//
function checkCapsule(){
	return machineStatus.capsuleLoaded;
}

