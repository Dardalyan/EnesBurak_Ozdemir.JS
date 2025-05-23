( async()=>{

    const init =  async ()=>{
        // add necessary fonts which is used in the original one
        // Quicksand font-family for the title
        add_google_fonts('https://fonts.googleapis.com/css2?family=Quicksand:wght@700&display=swap');
        // Poppins font-family for the rest
        add_google_fonts('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

        await buildHTML();
        buildCSS();
    }


    const add_google_fonts = (url)=>{
        // this method is used to add google fonts
        // to Make the page look like the original as much as possible
        const link = document.createElement('link');
        link.href = url;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }

    const buildHTML = async ()=> {



        // The container (top-element)
        const container = document.createElement("div");
        container.className ="container";

        //                                     My Title Hierarchy
        //--------------------------------------------------------------------------------------------------
        const header = document.createElement("div");
        header.className ="header";

        const title = document.createElement("div");
        title.className ="title";
        header.appendChild(title);

        const h2 = document.createElement("h2");
        h2.textContent ="Beğenebileceğinizi Düşündüklerimiz";
        title.appendChild(h2);

        container.appendChild(header);
        //--------------------------------------------------------------------------------------------------


        // The Slider -> to make carousel slide towards x direction via next and prev buttons
        const slider = document.createElement("div");
        slider.className ="slider";
        container.appendChild(slider);
        //--------------------------------------------------------------------------------------------------



        //                                      My Carousel Hierarchy
        //--------------------------------------------------------------------------------------------------

        const carousel = document.createElement("div");
        carousel.className ="carousel";

        // Fetch products unless it's been already stored in local storage
        let product_list =  await retrieve_data();

        //--------------------------------------------------------------------------------------------------


        // looping in products -----------------------------------------------------------------------------
        product_list.map((product,index)=>{

            // for each product ...
            const  [productItem,item]  = create_item();
            const [fav_button,image_popular,image_star_product]= create_top_item_icons_and_buttons(product,index);
            const [product_image,product_name] = create_product_identity(product);
            const ratings  = create_product_ratings();
            const pricing = create_product_price_info(product);
            const basket_button = create_basket_button();

            // add like-favourite button to item
            item.appendChild(fav_button);
            // add best selling image to item
            item.appendChild(image_popular);

            // in every even number add star-product icon
            if(image_star_product !== null)
                // add  star product to item
                item.appendChild(image_star_product);


            // add product image to the item
            item.appendChild(product_image);
            // add product name and brand to the item
            item.appendChild(product_name);
            // add ratings to the item
            item.appendChild(ratings);
            // add pricing to item
            item.appendChild(pricing);
            //add basket button to item
            item.appendChild(basket_button);

            // open new tab
            item.addEventListener("click", ()=>{
                window.open(product.url,'_blank')
            })

            // add item to product-item outer box (product-item)
            productItem.appendChild(item);
            // add product item to the carousel div
            carousel.appendChild(productItem);
        })

        // end loop ---------------------------------------------------------------------------


        // 260px width +2 x 15 for each product margin
        const itemWidth = 260 + 30;

        // taking wheeling ability from carousel div
        carousel.addEventListener('wheel', e => {
            e.preventDefault();
        }, { passive: false });

        // taking touch move from carousel div
        carousel.addEventListener('touchmove', e => {
            e.preventDefault();
        }, { passive: false });



        // prev button ------------------------------------------------------------
        const prev = document.createElement("div");
        prev.className ="prev";

        const prev_button = document.createElement("button");
        prev_button.setAttribute('id', "prev_button");

        //add event listener to prev button to slide items from right to left
        prev_button.addEventListener('click', () => {
            carousel.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        });

        prev.appendChild(prev_button);
        // ----------------------------------------------------------------------------

        // next button ------------------------------------------------------------
        const next = document.createElement("div");
        next.className ="next";

        const next_button = document.createElement("button");
        next_button.setAttribute('id', "next_button");


        //add event listener to prev button to slide items from left to right
        next_button.addEventListener('click', () => {
            carousel.scrollBy({ left: itemWidth, behavior: 'smooth' });
        });

        next.appendChild(next_button);
        // ----------------------------------------------------------------------------


        // add prev and next to the container
        container.appendChild(prev);
        container.appendChild(next);

        // add carousel to the slider
        slider.appendChild(carousel);

        // add container to the body
        document.body.appendChild(container);
    }

    const create_item = ()=>{
        // outer item box (div .product-item)
        const productItem = document.createElement("div");
        productItem.className ="product-item";

        // inner item box (div .item)
        const item = document.createElement("div");
        item.className ="item";

        return [productItem, item];
    }

    const create_top_item_icons_and_buttons = (product,index)=>{

        // like-favourite button
        const fav_button  = document.createElement("button");
        fav_button.setAttribute('id','fav');

        // get favs from the local storage to set background colori initially if it is stored in the local storage
        let favs = JSON.parse(localStorage.getItem('favs')) || [];

        // initial set
        if(favs.includes(product.url))
            fav_button.style.backgroundColor = "rgb(227, 148, 50)";


        // fav button add event listener
        fav_button.addEventListener('click', (event)=>{

            // disable item event listener
            event.stopPropagation();

            // get favs from the local storage
            let fav_collection = JSON.parse(localStorage.getItem('favs')) || [];

            // get background color
            let back_color = fav_button.style.backgroundColor;

            // button color setting
            fav_button.style.backgroundColor = back_color === "rgb(227, 148, 50)"
                ? "rgb(255, 255, 255)"
                : "rgb(227, 148, 50)";

            
            // Update favourite collection
            if(!fav_collection.includes(product.url))
                fav_collection.push(product.url);
            else{
                fav_collection.splice(fav_collection.indexOf(product.url), 1);
            }

            // Store updated list in the local storage
            localStorage.setItem('favs', JSON.stringify(fav_collection));
        })

        // best selling image
        const image_popular = document.createElement("img");
        image_popular.setAttribute('id', "popular");
        image_popular.setAttribute('src', "https://www.e-bebek.com/assets/images/cok-satan@2x.png");
        image_popular.setAttribute('alt', "popular");


        // star product image
        let   image_star_product = null;
        if(index % 2 === 0){
            image_star_product = document.createElement("img");
            image_star_product.setAttribute('id', "star");
            image_star_product.setAttribute('src', "https://www.e-bebek.com/assets/images/yildiz-urun@2x.png");
            image_star_product.setAttribute('alt', "star");
        }

        return [fav_button,image_popular,image_star_product];

    }

    const create_product_identity = (product)=>{

        // product image
        const product_image = document.createElement("img");
        product_image.setAttribute('id', "product_img");
        product_image.setAttribute('src', `${product.img}`);
        product_image.setAttribute('alt', "product_image");



        // product name
        const product_name = document.createElement("p");
        product_name.setAttribute('id', "product_name");

        // product brand
        const product_brand = document.createElement("strong");
        product_brand.setAttribute('id', "brand");

        // set product brand text into <strong>
        product_brand.textContent = `${product.brand} - `;

        // add <strong> into <p> (brand into name text)
        product_name.appendChild(product_brand);
        // set product name text into <p>
        product_name.appendChild(document.createTextNode(`${product.name}`));

        return [product_image,product_name];
    }


    const create_product_ratings = ()=>{

        // create ratings (5 full-filled yellow star)
        const ratings = document.createElement("div");
        ratings.className ="ratings";

        for(let i = 0;i<5;i++){
            const rating_yellow_star = document.createElement('img');
            rating_yellow_star.setAttribute('id', `rating${i}`); // id = rating1, rating2 ...
            rating_yellow_star.setAttribute('src', `https://img.icons8.com/?size=100&id=zWBbi62CYIKH&format=png&color=FAB005`);
            rating_yellow_star.setAttribute('alt', "star-rating");
            rating_yellow_star.setAttribute('width', "30px");
            rating_yellow_star.setAttribute('height', "100%");


            // add a yellow star, 5 times
            ratings.appendChild(rating_yellow_star);
        }

        // 1-100 auto generation
        const random_rating = Math.floor(Math.random() * 100) + 1;

        // rating number
        const rating_number = document.createElement("p");
        rating_number.textContent = `(${random_rating})`;

        // add rating number to ratings
        ratings.appendChild(rating_number);

        return ratings;
    }

    const create_product_price_info= (product)=>{

        // pricing div creation
        const pricing = document.createElement("div");
        pricing.className ="pricing";

        // discount div creation
        const discount  = document.createElement("div");
        discount.className ="discount";

        // old price
        const old_price = document.createElement("p");
        old_price.setAttribute('id', "old_price");
        old_price.textContent = `${product.original_price} TL`;

        // discount rate
        const discount_rate = document.createElement("p");
        discount_rate.setAttribute('id', 'discount_rate');

        // rate calculation
        let rate = (product.original_price - product.price) / product.original_price * 100;

        discount_rate.textContent = `%${Math.floor(rate)}`;

        // down arrow icon for discount
        const discount_icon = document.createElement("img");
        discount_icon.setAttribute('width', `20`);
        discount_icon.setAttribute('height', `20`);
        discount_icon.setAttribute('src','https://img.icons8.com/ios-filled/50/40C057/circled-down-2.png');
        discount_icon.setAttribute('alt', "discount-icon");

        // discount rate control if current < actual then we have a discount else we don't
        if(product.price >= product.original_price)
            discount.style.visibility = "hidden";

        // adding child elements to discount
        discount.appendChild(old_price);
        discount.appendChild(discount_rate);
        discount.appendChild(discount_icon);

        // actual div creation
        const actual  = document.createElement("div");
        actual.className ="actual";

        const actual_price = document.createElement("p");
        actual_price.setAttribute('id', "price");
        actual_price.textContent = `${product.price} TL`;


        // add price to the actual div
        actual.appendChild(actual_price);

        // adding child elements discount and actual to the pricing div
        pricing.appendChild(discount);
        pricing.appendChild(actual);

        return pricing;
    }


    const create_basket_button = ()=>{
        // create basket button
        const basket_button =  document.createElement("button");
        basket_button.setAttribute('id', "basket");
        basket_button.textContent = 'Sepete Ekle';
        return basket_button;
    }



    const buildCSS = () => {

        const style = document.createElement("style");

        style.textContent = `
        
        body{
           background-color:#fbfbfb;
        }
        
        /* container div */
        .container{
            max-width: 1296px;
            width: 90%;
            height:max-content;
            margin:auto;
            display: flex;
            justify-content: center;
            align-items: center;
            align-content: center;
            flex-direction: column;
            position: relative;
        }
        
        
        /*---------------  HEADER DIV AND TITLE STYLE ARRANGEMENTS ------------------ */
        
        .container .header{
            width:100%;
            margin:auto;
        
        }
        .container .header .title{
            display: flex;
            align-items: center;
            justify-content: space-between; 
            background-color: #fef6eb;
            padding: 25px 67px; 
            border-top-left-radius: 35px;
            border-top-right-radius: 35px;
        }
        
        .container .header .title h2{
            font-family:'Quicksand';
            font-size: 2.0rem;
            font-weight: 700;
            line-height: 1.11;
            color: #f28e00;
            margin:0;
        }
        /*--------------------------------------------------------------------------- */
        
        
        
        
        /*---------  The SLIDER, Carousel DIV,and Outter Product (for each product) Box STYLE ARRANGEMENTS ---------- */
        
        /*---------  SLIDER ---------- */
        .container .slider{
            height: 100%;
            width: 100%;
        }
        
        .container .carousel{
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            align-content: center;
            border-bottom-left-radius: 35px;
            border-bottom-right-radius: 35px;
            background-color: white;
            height: 560px;
            position:relative;
            overflow: auto;
            }
        
        
        .container .carousel::-webkit-scrollbar {
            display: none; 
        }
        
        .container .carousel .product-item{
            min-width: 260px;
            max-width: 260px;
            height: 93%;
            /*border:2px solid black;*/
            padding-top: 6px;
            padding-bottom: 6px;
            display: block;
            text-align: center;
            margin: auto;
            margin-left:15px;
            margin-right:15px;
        }
        /*--------------------------------------------------------------------------- */
        
        
        
        /*----------------------- Inner Box of a Product Box STYLE ARRANGEMENTS -------------------- */
        
        /* --------------- Item's Itself (box) --------------- */
        .container .carousel .product-item .item{
            z-index: 1;
            display: block;
            width: 100%;
            height: 100%;
            font-size: 12px;
        
            color: #7d7d7d;
            border: 1px solid rgb(234, 234, 234);
            border-radius: 10px;
            box-shadow: 1px 1px 3px  rgb(234, 234, 234);
        
            overflow: hidden;
        
            text-decoration: none;
            background-color: #ffff;
            cursor: pointer;
            margin: auto;
            position: relative;
            text-align: center;
        }
        
        .container .carousel .product-item .item:hover{
           border: 3px solid #f28e00;
        }
        /*---------------------------------------------- */
        
        
        
        /* ------- Product Image of an Item  ------- */
        .container .carousel .item  img#product_img{
            width: 99%;
            height: 200px;
            z-index:0;
            border:none;
        }
        /*------------------------------------------- */
        
        /* ------- Best Selling Small Icon on an Item  ------- */
        .container .carousel .item  img#popular{
            width: 50px;
            height: 50px;
            z-index: 15;
            position: absolute;
            top:3%;
            left:6%;
        }
        /*------------------------------------------------ */
        
        
        /* ------- Star Product Small Icon on an Item  ------- */
        .container .carousel .item  img#star{
            width: 50px;
            height: 50px;
            z-index: 15;
            position: absolute;
            top:13%;
            left:6%;
        }
        /*------------------------------------------------ */
        
        /* ------- Hearth (favourite) Icon on an Item  ------- */
        .container .carousel .item button#fav{
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: white;
            background-image: url("https://www.e-bebek.com/assets/svg/default-favorite.svg");
            background-size: 25px 25px;
            background-position: center;
            background-repeat: no-repeat;
            position: absolute;
            top:2%;
            right:6%;
            cursor:pointer;
            z-index: 5;
            border: 1px solid rgb(234, 234, 234);
            box-shadow: 2px 2px 6px  rgb(234, 234, 234);
        
        }
        
        .container .carousel .item button#fav:hover{
            background-size: 50px 50px;
            background-image: url("https://www.e-bebek.com/assets/svg/default-hover-favorite.svg");
        }
        /*------------------------------------------------ */
        
        
        /* ------- The Name and the Brand of an Item ------- */
        .container .carousel .item p#product_name{
            width: 95%;
            font-size: 0.7rem;
            font-family: 'Poppins',sans-serif;
            margin-top: 15%;
            margin-left: 15px;
            margin-right: 15px;
            font-weight: 500;
            white-space: normal;
            word-break: break-word;
            display: -webkit-box;
            overflow: hidden;
            line-height: 0.9rem;
            height: 35px;
        }
        
        .container .carousel .item  strong#brand{
            font-family: initial;
            font-size: 0.7rem;
            font-weight: 700;
        }
        /*------------------------------------------------ */
        
        
        /* ------- Star Rating DIV, Star Images and Number of Like (p- element)  ------- */
        .container .carousel .item .ratings {
            padding: 15px;
            display: flex;
            flex-direction: row;
            width: 100%;
            height: 20px;
            align-items: center;
            margin-top: -5%;
        }
        
        
        .container .carousel .item .ratings p{
            display: flex;
            font-size: 0.9rem;
            flex-direction: row;
            width: 100%;
            margin: 2px;
        }
        
        /*-------------------------------------------------------------------*/
        
        /* ------- The Pricing DIV, Price and Discount ------- */
        .container .carousel .item .pricing{
            margin-top: -2.5%;
            width: 100%;
            text-align: left;
            /*border:1px solid red;*/
            font-family: 'Poppins', sans-serif;
        }
        
        .container .carousel .item .pricing .discount{
            width: 100%;
            overflow: hidden;
            display: inline-flex;
            align-items: center;
            height: 30px;
            /*border:1px solid blue;*/
        }
        
        .container .carousel .item .pricing .discount p#old_price{
            margin-left:6%;
            font-weight: 400;
            font-size: 15px;
            text-decoration: line-through;
        }
        .container .carousel .item .pricing .discount p#discount_rate{
            color:#00a365;
            font-weight: 700;
            font-size: 20px;
            margin-left: 5px;
        }
        
        .container .carousel .item .pricing .discount img{
            margin-left:1px;
        }
        
        .container .carousel .item .pricing .actual{
            padding: 0;
            width: 100%;
            height: 30px;
            overflow: hidden;
            display: inline-flex;
            align-items: center;
            /*border:1px solid green;*/
        }
        
        .container .carousel .item .pricing .actual p#price{
            font-weight: 600;
            font-size: 1.4rem;
            margin-left:6%;
        }
        /*------------------------------------------------------*/
        
        
        /* ------- The Basket Button for Each Item ------- */
        .container .carousel .item button#basket{
            width: 85%;
            background-color: #fef6eb;
            color:#f28e00;
            height: 48px;
            border-radius: 37.5px;
            border: none;
            position: absolute;
            bottom: 4%;
            left: 7.5%;
            margin: auto;
            cursor: pointer;
        
            font-size: 0.95rem;
            font-weight: 700;
        }
        
        .container .carousel .item button#basket:hover{
            background-color: #f28e00;
            color:white;
        }
        
        /*-------------------------------------------------------------------*/
        
        
        
        
        /* ------- Prev-Next Button  ------- */
        .container .prev button{
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color:#fef6eb;;
            position: absolute;
            z-index: 15;
            left:-5%;
            bottom: 50%;
            margin-right: 120px;
            cursor: pointer;
            border: none;
            background-image: url("https://cdn06.e-bebek.com/assets/svg/prev.svg");
            background-size: 25px 25px;
            background-position: center;
            background-repeat: no-repeat;
        
        }
        .container  .next button{
            width: 50px;
            height: 50px;
            position: absolute;
            background-color:#fef6eb;;
            border-radius: 50%;
            z-index: 15;
            right: -5%;
            bottom: 50%;
            cursor: pointer;
            border: none;
            background-image: url("https://cdn06.e-bebek.com/assets/svg/next.svg");
            background-size: 25px 25px;
            background-position: center;
            background-repeat: no-repeat;
        
        
        }
        
        .container  .next button:hover{border:1px solid #f28e00;background-color:white;}
        .container  .prev button:hover{border:1px solid #f28e00;background-color:white;}
        /*-------------------------------------------------------------------*/
        
        `;

        document.head.appendChild(style);
    }

    let retrieve_data = async ()=>{

         let data = localStorage.getItem('products');
         if(data  !== null ) {
             console.log('Data collected from the local storage !');
             data = JSON.parse(localStorage.getItem('products'));
         }
         else data =  await get_carousel_data();

         return data;
    }

    let get_carousel_data = async () => {

        let response;
        try {
            // get data from public url
            response = await fetch("https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json");
        } catch (err) {
            console.log(err);
        }
        let data =  await response.json();

        // set data to local storage
        localStorage.setItem('products',JSON.stringify(data));

        // Set an empty array as favourites
        localStorage.setItem('favs',JSON.stringify([]));

        console.log('Data has been fetched from the public url !');
        return data;
    }

    await init();
})();





