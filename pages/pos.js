import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React, { useState, useEffect, useRef } from 'react';

import fetchAcqua from '../components/fetchAcqua';
import fetchUvicorn from '../components/fetchUvicorn';

// Import the products data
import backupProductsData from '../public/products.json';

import axios from 'axios';


const enumProviders = {
    BACKUPLOCAL: 'DEV_BACKUPLOCAL',
    ACQUA: 'ACQUA',
    ACQUAMIRROR: 'ACQUAMIRROR',
    PERSONAL: 'PERSONAL',
    BACKUPONLINE1: 'BACKUPONLINE1',
    BACKUPONLINE2: 'BACKUPONLINE2',

}


async function downloadS3Object(url) {
    try {
      const fetchResponse = await fetch(url);
    //   console.log(await fetchResponse.text());
    //   console.log(await fetchResponse.json());
    //   return await fetchResponse.json();

        let textResponse = await fetchResponse.text();
        // return jsonResponse;
        // console.log(textResponse);
        const jsonResponse = JSON.parse(textResponse);
        // console.log('Downloaded JSON', jsonResponse);
        return jsonResponse;

    } catch (err) {
      console.error('Error - ', err);
    }
  }
  

export default function Home() {
    const [barcode, setBarcode] = useState('');
    const [actualBarcode, setActualBarcode] = useState('');

    const [loadedProductsData, setLoadedProductsData] = useState([]);
    const [lastKeyTime, setLastKeyTime] = useState(Date.now());
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [sourceProvider, setSourceProvider] = useState(enumProviders.BACK);


    // State for search functionality
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // Refs for inputs
    const quantityRef = useRef(null);
    const discountRef = useRef(null);
    const priceRef = useRef(null);
    const searchInputRef = useRef(null);

    React.useEffect(async () => {

        let initalData = backupProductsData;
        const data1 = await downloadS3Object('https://code-cli.s3.amazonaws.com/mely/current/products.json');
        // console.log('Backup Online 1', data1);
        if (data1 && data1.length > 10) {
            setLoadedProductsData(data1);
            console.log('Backup Online 1 Products Fetched.');

        }
    }, []);

    async function getFromDataProvider() {

        switch (sourceProvider) {
            case enumProviders.BACKUPLOCAL:
                setLoadedProductsData(backupProductsData);
                console.log("Local backup done.")
                break;
            case enumProviders.ACQUA:
                // const data = await fetchAcqua();
                // console.log("Data from Acqua", data);
                // return data;
                break;
            case enumProviders.ACQUAMIRROR:
                // axios.get('http://127.0.0.1:8000/mely/products_acqua').then((response) => {
                axios.get('https://crvmb5tnnr.us-east-1.awsapprunner.com/mely/products_acqua').then((response) => {
                    // console.log('response', response.data);
                    if (response.data && response.data.length > 10) {
                        setLoadedProductsData(response.data);
                        console.log('Uvicor Products Fetched.');
                    }
                }
                ).catch((error) => {
                    console.error('Error fetching products:', error.response?.data || error.message);
                }
                );
                break;


            case enumProviders.PERSONAL:
                break;
            case enumProviders.BACKUPONLINE1:
                
                const data1 = await downloadS3Object('https://code-cli.s3.amazonaws.com/mely/current/products.json');
                // console.log('Backup Online 1', data1);
                if (data1 && data1.length > 10) {
                    setLoadedProductsData(data1);
                    console.log('Backup Online 1 Products Fetched.');
                }
                break;


            case enumProviders.BACKUPONLINE2:
                // axios.get('https://code-cli.s3.amazonaws.com/mely/backup/products.json').then((response) => {
                //     console.log('Backup Line 2', response.data[2]);
                //     if (response.data && response.data.length > 10) {
                //         setLoadedProductsData(response.data);
                //         console.log('Backup Online 2 Products Fetched.');
                //     }
                // });
                const data2 = await downloadS3Object('https://code-cli.s3.amazonaws.com/mely/backup/products.json');
                if (data2 && data2.length > 10) {
                    setLoadedProductsData(data2);
                    console.log('Backup Online 2 Products Fetched.');
                }
                break;
            default:
                return loadedProductsData;
        }

    }


    useEffect(() => {
        let timer;

        const handleKeyDown = (e) => {
            const currentTime = Date.now();
            const timeDiff = currentTime - lastKeyTime;

            // Update the last key time
            setLastKeyTime(currentTime);

            // If the time between keystrokes is less than 50ms, it's likely a barcode scanner
            if (timeDiff < 50) {
                setBarcode((prevBarcode) => prevBarcode + e.key);
            } else {
                // If not, reset the barcode
                setBarcode(e.key);
            }

            // If 'Enter' is pressed, assume the barcode scan is complete
            if (e.key === 'Enter') {
                if (barcode.length > 5) { // Adjust based on your barcode length
                    handleBarcode(barcode);
                }
                setBarcode(''); // Reset after processing
            }

            // Reset barcode after a timeout
            clearTimeout(timer);
            timer = setTimeout(() => {
                setBarcode(''); // Reset if no input for 300ms
            }, 300);

            // Keyboard shortcuts for focusing fields and clearing cart
            if (e.key === 'F9') {
                setCart([]); // Clear the cart
            } else if (e.key === 'F1' && quantityRef.current) {
                priceRef.current.focus(); // Focus on the price input
            } else if (e.key === 'F2' && discountRef.current) {
                quantityRef.current.focus(); // Focus on the quantity input
            } else if (e.key === 'F3' && priceRef.current) {
                discountRef.current.focus(); // Focus on the discount input
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(timer);
        };
    }, [barcode, lastKeyTime]);

    const handleBarcode = (scannedBarcode) => {
        console.log('Scanned Barcode:', scannedBarcode);
        setActualBarcode(scannedBarcode);

        // Lookup the products based on the scanned barcode
        const matchedProducts = loadedProductsData.filter(
            (item) => item['Cod. Barra'] === scannedBarcode
        );

        if (matchedProducts.length > 0) {
            // if more than one product is found, show all of them in the product searcher


            setSelectedProducts(matchedProducts);
            if (matchedProducts.length > 1) {
                querySearch(scannedBarcode);
                return;
            }
            addToCart(matchedProducts[0]); // Automatically add the first matching product to the cart
        } else {
            setSelectedProducts([]);
            alert(`No products found for barcode: ${scannedBarcode}`);
        }
    };

    // Handle adding products to the cart
    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find((item) => item.Detalle === product.Detalle);
            if (existingProduct) {
                existingProduct.quantity += 1;
                return [...prevCart];
            }
            return [...prevCart, { ...product, totalPrice: product.Precio, quantity: 1, discount: 0 }];
        });
        updateTotal();
    };

    // Function to update the total price
    const updateTotal = () => {
        const newTotal = cart.reduce((acc, item) => {
            const discountedPrice = item.Precio - (item.Precio * item.discount) / 100;
            return acc + discountedPrice * item.quantity;
        }, 0);
        setTotal(newTotal);
    };

    // Function to update the quantity of products
    const updateQuantity = (index, newQuantity) => {
        const newCart = [...cart];
        newCart[index].quantity = newQuantity;
        setCart(newCart);
        updateTotal();
    };

    // Function to apply a discount to a product
    const applyDiscount = (index, discount) => {
        const newCart = [...cart];
        newCart[index].discount = discount;
        setCart(newCart);
        updateTotal();
    };

    // Function to update the price of a product
    const updatePrice = (index, newPrice) => {
        const newCart = [...cart];
        newCart[index].Precio = newPrice;
        setCart(newCart);
        updateTotal();
    };

    // Function to remove a product from the cart
    const removeFromCart = (index) => {
        const newCart = cart.filter((item, i) => i !== index); // Remove the item by index
        setCart(newCart);
        updateTotal();
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value;
        querySearch(query);

    };

    const querySearch = (query) => {
        setSearchQuery(query);

        if (query.trim().length === 0) {
            setSearchResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const results = loadedProductsData.filter((product) =>
            product.Detalle.toLowerCase().includes(lowerQuery) ||
            product['Cod. Barra'].toLowerCase().includes(lowerQuery) ||
            // Add more fields to search if necessary
            (product['OtherField'] && product['OtherField'].toLowerCase().includes(lowerQuery)) // Replace 'OtherField' with actual field
        );

        // if results more than hundred, show only 100
        if (results.length > 100) {
            results.length = 100;
        }
        setSearchResults(results);
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>POS Barcode Scanner</title>
                <meta name="description" content="React POS app with barcode scanning and product search" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>POS Mely</h1>
                <p className={styles.description}>
                    Debug Keystroke: <strong>{barcode}</strong>
                </p>

                <div className={styles.barcodeInput}>
                    <label htmlFor="actualBarcode">Last Scanned Barcode:</label>
                    <p>{actualBarcode}</p>
                    {/* <input
            type="text"
            id="actualBarcode"
            value={actualBarcode}
            onChange={(e) => handleManualBarcodeChange(e)}
            placeholder="Scan or enter barcode"
            className={styles.input}
          /> */}
                </div>

                {/* Flex Container for Search and Cart */}
                <div className={styles.content}>
                    {/* Search Section */}
                    <div className={styles.searchSection}>
                        <h2>Buscar Producto</h2>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Ingrese nombre, Codigo de Barra o detalle del producto"
                            className={styles.input}
                            ref={searchInputRef}
                        />
                        {searchResults.length > 0 && (
                            <div className={styles.searchResults}>
                                <h3>Resultados de Búsqueda</h3>
                                {searchResults.map((product, index) => (
                                    <div key={index} className={styles.searchResultItem}>
                                        <p><strong>{product.Detalle}</strong></p>
                                        <p>Codigo de Barra: {product['Cod. Barra']}</p>

                                        <p>Precio: ${product.Precio}</p>
                                        <button onClick={() => addToCart(product)}>Agregar al Carrito</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Carrito de Compras Section */}
                    <div className={styles.cartSection}>
                        <h3>Carrito de Compras</h3>
                        {cart.length === 0 ? (
                            <p>El carrito está vacío.</p>
                        ) : (
                            cart.map((item, index) => (
                                <div key={index} className={styles.cartItem}>
                                    <h4>{item.Detalle}</h4>
                                    <p>
                                        <span>[ F1 ] </span>Precio:
                                        <input
                                            ref={priceRef}
                                            type="number"

                                            value={item.Precio}
                                            onChange={(e) => updatePrice(index, parseFloat(e.target.value))}
                                            min="0"

                                            className="productInput"
                                        />
                                    </p>
                                    <p>
                                        <span>[ F2 ]</span> Cantidad:
                                        <input
                                            ref={quantityRef}
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                                            min="1"
                                            max="9999" //Para evitar errores
                                            className="productInput"
                                        />
                                    </p>
                                    <p>
                                        Descuento:
                                        <input
                                            ref={discountRef}
                                            type="number"
                                            value={item.discount}
                                            onChange={(e) => {
                                                // if not int is 0
                                                if (isNaN(parseInt(e.target.value))) {
                                                    // e.target.value = 0;
                                                    return;
                                                }
                                                if (parseInt(e.target.value) < 0) {
                                                    e.target.value = 0;
                                                }
                                                if (parseInt(e.target.value) > 100) {
                                                    e.target.value = 100;
                                                }

                                                applyDiscount(index, parseInt(e.target.value))
                                            }}
                                            style={{ width: '60px' }}
                                            min="0"
                                            max="100"
                                            className="productInput"
                                        /> %
                                    </p>
                                    <p>
                                        Precio Total: ${((item.Precio - (item.Precio * item.discount) / 100) * item.quantity).toFixed(2)}
                                    </p>
                                    <p>
                                        Codigo de Barra: {item?.['Cod. Barra']}
                                    </p>

                                    <button onClick={() => removeFromCart(index)} className={styles.removeButton}>Eliminar</button> {/* Remove Button */}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Total Section */}
                <div className={styles.totalSection}>
                    <h3>Total a Pagar: ${total.toFixed(2)}</h3>
                </div>

                {/* Action Buttons */}
                <div className={styles.actionButtons}>
                    <button onClick={() => setCart([])}>F9 - Limpiar</button>
                    <button onClick={() => alert('No esta disponible xd')}>F5 - Registrar Compra</button>

                </div>
                <br />
                <div className={styles.actionButtons}>
                    
                    <p>{sourceProvider}</p>
                    <select name="server_endpoint" id="" onChange={(e) => { setSourceProvider(e.target.value) }}>

                        <option value={enumProviders.BACKUPONLINE1}>Backup Online 1</option>
                        <option value={enumProviders.ACQUAMIRROR}>Acqua Mirror</option>
                        <option value={enumProviders.BACKUPONLINE2}>Backup Online 2</option>
                        <option value={enumProviders.BACKUPLOCAL}>Dev Backup</option>
                        <option value={enumProviders.ACQUA}>Acqua Server</option>
                        <option value={enumProviders.PERSONAL}>Personal Server</option>
                    </select>
                    <button onClick={getFromDataProvider} > Actualizar Productos </button>
                    
                </div>
            </main>
        </div>
    );
}
