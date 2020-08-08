let modalQt = 1;
let precoItem = 0;
let tipoPizza;
let itemSelecionado;
let cart = [];
let valorTotal = 0;

document.querySelector('.success.pizzaWindowArea').style.display = 'none';

const api = fetch(
  
    "https://edinfotech.github.io/pizzariaDelivery/apiPizzaList.json"
)
	.then((response) => response.json())
	.then((data) => {

        data.map((item, index) => {
        var pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);
        tipoPizza = item.price;

        pizzaItem.setAttribute('data-key', index);
        pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
        pizzaItem.querySelector('.pizza-item--img img').src = item.img;
        pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
        pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${tipoPizza[2].toFixed(2)}`;

        abrirModal(pizzaItem, item, tipoPizza);

        document.querySelector('.pizza-area').append(pizzaItem);

    });
});
function abrirModal(pizzaItem, item, tipoPizza) {
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        itemSelecionado = item;

        preencheModal(itemSelecionado);

        document.querySelector('.pizzaWindowArea').style.opacity = 0;
        document.querySelector('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            document.querySelector('.pizzaWindowArea').style.opacity = 1;
        }, 200);

    });
}
function preencheModal(itemSelecionado) {
    modalQt = 1;
    let pizzaSelecionada = document.querySelector('.pizzaWindowBody');
    precoItem = itemSelecionado.price[2];
    pizzaSelecionada.querySelector('.pizzaInfo h1').innerHTML = itemSelecionado.name;
    pizzaSelecionada.querySelector('.pizzaBig img').src = itemSelecionado.img;
    pizzaSelecionada.querySelector('.pizzaInfo--desc').innerHTML = itemSelecionado.description;
    pizzaSelecionada.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${itemSelecionado.price[2].toFixed(2)}`;
    pizzaSelecionada.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
    pizzaSelecionada.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
        if (sizeIndex == 2) {
            size.classList.add('selected');
        }
        size.querySelector('span').innerHTML = itemSelecionado.sizes[sizeIndex];
    });
    pizzaSelecionada.querySelector('.pizzaInfo--qt').innerHTML = modalQt;
}

function fecharModal() {
    document.querySelector('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        document.querySelector('.pizzaWindowArea').style.display = 'none';
    }, 300);
}


document.querySelectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', fecharModal);
});

document.querySelector('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        valorTotal = precoItem * modalQt;
        document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;
        document.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${valorTotal.toFixed(2)}`;
    }
});


document.querySelector('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    valorTotal = precoItem * modalQt;
    document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;
    document.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${valorTotal.toFixed(2)}`;
});

document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        modalQt = 1;
        document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;

        size.classList.add('selected');

        tipoPizza = itemSelecionado.price;
        let valorPizza = tipoPizza[sizeIndex];
        precoItem = valorPizza;
        document.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${valorPizza.toFixed(2)}`;
    });
});

document.querySelector('.pizzaInfo--addButton').addEventListener('click', () => {
    let tamanhoPizza = parseInt(document.querySelector('.pizzaInfo--size.selected').getAttribute('data-key'));
    let tamanhoPizzaText = document.querySelector('.pizzaInfo--size.selected').innerText;
    let id = itemSelecionado.id;
    let identifier = id + '@' + tamanhoPizza;
    let key = cart.findIndex((item) => item.identifier == identifier);

    if (key > -1) {
        cart[key].quantidade += modalQt;
    } else {
        cart.push({
            id,
            identifier,
            nomePizza: itemSelecionado.name,
            tamanhoPizzaText,
            quantidade: modalQt,
            img: itemSelecionado.img,
            valorUnitarioPizza: itemSelecionado.price[tamanhoPizza]
        });
    }

    updateCart();
    fecharModal();

});

function updateCart() {
    document.querySelector('.menu-openner span').innerHTML = cart.length;
    let subtotal = 0;
    let valorTotalItem = 0;
    let desconto = 0;
    let total = 0;
    if (cart.length > 0) {
        document.querySelector('aside').classList.add('show');
        document.querySelector('.cart').innerHTML = '';
        for (let i in cart) {

            let pizzaItem = cart[i];
            let index = i;
            let cartItem = preencheCart(pizzaItem, index);
            let valor = pizzaItem.valorUnitarioPizza * pizzaItem.quantidade;
            valorTotalItem += valor;
            document.querySelector('.cart').append(cartItem);

        }
        subtotal += valorTotalItem;
        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        document.querySelector('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        document.querySelector('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        document.querySelector('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        document.querySelector('aside').classList.remove('show');
        document.querySelector('aside').style.left = '100vw';
    }

}
function preencheCart(pizzaItem, index) {
    let carrinho = document.querySelector('.models .cart--item').cloneNode(true);
    let pizzaName = `${pizzaItem.nomePizza} (${pizzaItem.tamanhoPizzaText})`;

    carrinho.querySelector('img').src = pizzaItem.img;
    carrinho.querySelector('.cart--item-nome').innerHTML = pizzaName;
    carrinho.querySelector('.cart--item--qt').innerHTML = pizzaItem.quantidade;


    quantidade(carrinho, pizzaItem, index);
    return carrinho;
}

function quantidade(carrinho, pizzaItem, index) {
    carrinho.querySelector('.cart--item-qtmais').addEventListener('click', () => {
        pizzaItem.quantidade++;
        updateCart();
    });
    carrinho.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
        if (pizzaItem.quantidade > 1) {
            pizzaItem.quantidade--;
        } else {
            for (let i in cart) {
                if (index == i) {
                    cart.splice(i, 1);
                }
            }
        }
        updateCart();
    });
}

document.querySelector('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        document.querySelector('aside').style.left = '0';
    }
});

document.querySelector('.menu-closer').addEventListener('click', () => {
    if (cart.length > 0) {
        document.querySelector('aside').style.left = '100vw';
    }
});

document.querySelector(".cart--finalizar").addEventListener("click", () => {
    cart = [];
    document.querySelector('.success.pizzaWindowArea').style.opacity = 0;
    document.querySelector('.success.pizzaWindowArea').style.display = 'flex';
    updateCart();
    setTimeout(()=>{
        document.querySelector('.success.pizzaWindowArea').style.opacity = 1;
    },100);
    document.querySelector('.success.pizzaWindowArea').style.display = 'flex';
    setTimeout(() => {
		document.querySelector('.success.pizzaWindowArea').style.opacity = 0;
		setTimeout(() => {
			document.querySelector('.success.pizzaWindowArea').style.display = "none";
		}, 200);
	}, 2000);
});
