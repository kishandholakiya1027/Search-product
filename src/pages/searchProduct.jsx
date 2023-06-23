import axios from 'axios'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'

const SearchProduct = () => {
    const [products, setProducts] = useState([])
    const [allBooks, setAllBooks] = useState([])
    const [token, setToken] = useState([])
    const [loader, setloader] = useState(false)
    const fetchData = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Cookie", "lidc=\"b=VB49:s=V:r=V:a=V:p=V:g=8604:u=11:x=1:i=1687514916:t=1687600882:v=2:sig=AQGHR8VU4m_vo7W594ldfcHUS76FeXDl\"; bcookie=\"v=2&0c3c4b3d-7f29-4b62-8f97-5ce975f3e477\"");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    };
    React.useEffect(() => {

        // fetchData();
    }, []);
    useEffect(() => {
        setloader(true)
        axios.get(`https://api.crossref.org/works`).then(({ data }) => {
            setProducts(data?.message?.items)
            setloader(false)
            setAllBooks(data?.message?.items)

        })
    }, [])


    const onChangeProduct = async (event) => {
        setloader(true)
        setProducts([])
        let res = await axios.get(`https://api.crossref.org/works?query.author=${event?.target?.value}&query.container-title=${event?.target?.value}`)
        if (res?.data?.message?.items?.length) {
            setProducts(res?.data?.message?.items)
            setloader(false)

        } else {
            let res = await axios.get(`https://api.crossref.org/works?query.author=${event?.target?.value}`)
            if (res?.data?.message?.items?.length) {
                setProducts(res?.data?.message?.items)
                setloader(false)


            } else {
                let res = await axios.get(`https://api.crossref.org/works?query.container-title=${event?.target?.value}`)
                setProducts(res?.data?.message?.items?.length ? res?.data?.message?.items || [] : allBooks)
                setloader(false)

            }
        }


    }
    return (
        <div>
            <div className="row">
                <div className='col-lg-12 col-md-12 mt-5'>
                    <h4>Books</h4>
                </div>
                <input onChange={(e) => setToken(e?.target?.value)} />
                <button onClick={fetchData}>get</button>
                <div className="col-md-8 mx-auto mt-3">
                    <div className="input-group">
                        <input className="form-control border-end-0 border rounded-pill" onChange={_.debounce((data) => onChangeProduct(data), 1500)} type="search" placeholder="search by book title,author" id="example-search-input" />
                    </div>
                </div>
            </div>
            <div className='row '>
                <div className='col-lg-12 col-md-12 mt-5'>
                    {loader &&
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>}
                </div>
                {products?.map(book => {

                    return <div className='col-lg-3 col-md-3 my-3'>
                        <div className='card'>
                            {/* <img src="..." class="card-img-top" alt="..." /> */}
                            <div class="card-body">
                                <h5 class="card-title">{book?.title}</h5>
                                <p class="card-text">{book?.[`container-title`] && book?.[`container-title`][0]}</p>
                                <div className='d-flex justify-content-between'>

                                    <p>{book?.author && `${book?.author[0]?.family || book?.author[0]?.name || ""} ${book?.author[0]?.given || ""}`}</p>
                                    <p>{book?.publisher}</p>
                                </div>
                                <a href={`${book?.URL}`} class="btn btn-primary">See Book</a>
                            </div>

                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}

export default SearchProduct