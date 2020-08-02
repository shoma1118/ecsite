let login = (event) => {
	event.preventDefault();
	let jsonString = {
		'userName':$('input[name=userName]').val(),
		'password':$('input[name=password]').val()
	};
	
	$.ajax({
		type: 'POST',
		url: '/ecsite/api/login',
		data: JSON.stringify(jsonString),
		contentType: 'application/json',
		datatype: 'json',
		scriptCharset: 'utf-8'
	})
	.then((result) => {
		let user = JSON.parse(result); //文字列を JSON として解析し、JavaScript の値に変換
		$('#welcome').text(` -- ようこそ！ ${user.fullName} さん`); // 変数の中身を表示するためバッククォートで囲む(Shift＋@キー)
		$('#hiddenUserId').val(user.id);
		$('input[name=userName]').val('');
		$('input[name=password]').val('');
	}, () => {
		console.error('Error: ajax connection failed.');
	});
};
let addCart = (event) => {
	/* $(event.target)：押下したカートに入れるボタン
	 * $(event.target).parent().parent()：カートに入れるボタンの親要素の親要素なので<tr>
	 * $(event.target).parent().parent().find('td')：押下したカートに入れるボタンの<tr>の中にある<td>を取得
	 */
	let tdList = $(event.target).parent().parent().find('td'); 
	let id = $(tdList[0]).text(); // 取得した<td>の1列目のテキストを取得
	let goodsName = $(tdList[1]).text(); // 取得した<td>の2列目のテキストを取得
	let price = $(tdList[2]).text(); // 取得した<td>の3列目のテキストを取得
	let count = $(tdList[3]).find('input').val(); // 取得した<td>の4列目のテキストを取得
	if (count ==='0' || count === '') {
		alert('注文数が0または空欄です。');
		return;
	}
	
	let cart = {
		'id' : id,
		'goodsName' : goodsName,
		'price' : price,
		'count' : count
	};
	cartList.push(cart); 
	
	let tbody = $('#cart').find('tbody');
	$(tbody).children().remove(); // tbodyの子要素をすべて削除

	// カートのテーブルを作成
	cartList.forEach(function(cart, index) {
		let tr = $('<tr />');
		$('<td />', {'text': cart.id}).appendTo(tr);
		$('<td />', {'text': cart.goodsName}).appendTo(tr);
		$('<td />', {'text': cart.price}).appendTo(tr);
		$('<td />', {'text': cart.count}).appendTo(tr);
		let tdButton = $('<td />');
		$('<button />',{
			'text' : 'カート削除',
			'class' : 'removeBtn',
		}).appendTo(tdButton);
		$(tdButton).appendTo(tr);
		$(tr).appendTo(tbody);
	});
	
	$('.removeBtn').on('click', removeCart);
};

let buy = (event) => {
	$.ajax({
		type: 'POST',
		url: '/ecsite/api/purchase',
		data: JSON.stringify({
			"userId": $('#hiddenUserId').val(),
			"cartList": cartList
		}),
		contentType: 'application/json',
		datatype: 'json',
		scriptCharset: 'utf-8'
	})
	.then((result) => {
		alert('購入しました。');

	}, () => {
			console.error('Error: ajax connection failed.');
	});	
};

let removeCart = (event) => {

	const tdList = $(event.target).parent().parent().find('td');
	let id = $(tdList[0]).text();
	// 「カート削除」ボタンを押下した行以外のカート情報をcartListに代入
	cartList = cartList.filter(function(cart) {
		return cart.id !== id;
	});
	 $(event.target).parent().parent().remove();
};

let showHistory = () => {
	$.ajax({
		type: 'POST',
		url: '/ecsite/api/history',
		data: JSON.stringify({"userId": $('#hiddenUserId').val()}),
		contentType: 'application/json',
		datatype: 'json',
		scriptCharset: 'utf-8'
	})
	.then((result) => {
		let historyList = JSON.parse(result);
		let tbody = $('#historyTable').find('tbody');

		$(tbody).children().remove();
		historyList.forEach(function(history, index) {
			let tr = $('<tr />');
			
			$('<td />', {'text': history.goodsName}).appendTo(tr);
			$('<td />', {'text': history.itemCount}).appendTo(tr);
			$('<td />', {'text': history.createdAt}).appendTo(tr);

			$(tr).appendTo(tbody);
		});
		$("#history").dialog("open");
	}, () => {
			console.error('Error: ajax connection failed.');
	});
	
};