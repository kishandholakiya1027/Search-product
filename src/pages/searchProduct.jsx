import axios from 'axios'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'

const SearchProduct = () => {
    const [products, setProducts] = useState([])
    const [allBooks, setAllBooks] = useState([])
    const [loader, setloader] = useState(false)

    useEffect(() => {
        setloader(true)
         axios.get(`https://api.crossref.org/works`).then(({data})=>{
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
                setProducts(res?.data?.message?.items?.length ? res?.data?.message?.items || []:allBooks)
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