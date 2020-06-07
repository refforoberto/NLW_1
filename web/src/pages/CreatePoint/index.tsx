import React, { useEffect, useState , ChangeEvent, FormEvent} from 'react';
import './styles.css';
import logo from '../../assets/logo.svg';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';

import { Link , useHistory} from 'react-router-dom';

import Dropzone from '../../components/Dropzone';

import api from '../../services/api';
import axios  from 'axios';
import { LeafletMouseEvent } from 'leaflet';

interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUFResponse {
    sigla: string
}

interface IBGEMunicipioResponse {
    id: number;
    nome: string;
}

interface City {
    id: number;
    name: string;
}


const baseUrlIbge: string = `https://servicodados.ibge.gov.br/api/v1/localidades/`;

const CreatePoint = () => {

    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [selectedUF, setSelectedUF] = useState<string>("0");
    const [selectedCity, setSelectedCity] = useState<string>("0");
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);

    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedfile, setSelectedfile] = useState<File>();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''         
    });

    const history = useHistory();

    // executa uma unica vez, quando o componente é criado
    useEffect(() => {
        api.get('items').then( response => {
            setItems(response.data);        
        });
    },[]);


    useEffect(()=> {
        axios.get<IBGEUFResponse[]>(`${baseUrlIbge}estados`)
        .then( response => {
            const ufInitials = response.data.map(uf => uf.sigla);
            setUfs(ufInitials);
        })
    },[]);


    useEffect(()=> {
        if(selectedUF === "0") return;
        
        axios.get<IBGEMunicipioResponse[]>(`${baseUrlIbge}estados/${selectedUF}/municipios`)
        .then( response => {
            const cities: City[] = response.data.map( c => ({ id: c.id , name: c.nome }));
            setCities(cities);
        })
        
    },[selectedUF]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const {latitude, longitude } = position.coords;           
            setInitialPosition([latitude, longitude])
            setSelectedPosition([latitude, longitude])
        })
    },[]);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement> ) {
        setSelectedUF(event.target.value);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement> ) {
        setSelectedCity(event.target.value);        
    }

    function handleSelectPosition(event: LeafletMouseEvent ) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ]);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});  
    }

    function handleSelectItem(id: number) {

        const existsSelected = selectedItems.findIndex(index => index === id);

        if(existsSelected >=0) {
            const filtereditems = selectedItems.filter(item => item !== id);
            setSelectedItems(filtereditems)
        } else {
            setSelectedItems([...selectedItems, id])
        }      
        
    }
    
   async function  handleSubmit(event: FormEvent) {
        event.preventDefault();


        const {name , email, whatsapp} = formData;
        const uf = selectedUF;
        const city = selectedCity;
        const [latitude, longitude]= selectedPosition;
        const items = selectedItems;

        const data = new FormData();       
        data.append('name' , name);
        data.append('email' , email);
        data.append('whatsapp', whatsapp );
        data.append('uf' , uf);
        data.append('city' , city);
        data.append('latitude' , String(latitude) );
        data.append('longitude' , String(longitude) );
        data.append('items' , items.join(',') );
        if (selectedfile) {
            data.append('image' , selectedfile );
        }

        await api.post('points',data);

        alert("Ponto de coleta cadastrado")  
       
         history.push("/")
    } 
    
    return (
       <div id="page-create-point">
           <header>
               <img src= { logo } alt="Ecoleta"/>
               <Link to="/">
                   <FiArrowLeft/>
                   Voltar para home
               </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/> ponto de coleta</h1>
               
                <Dropzone onFileUpload = { setSelectedfile } />
              
                <fieldset>
                    <legend>
                        <h2>Dados</h2>                        
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            type="text"
                            id="name"
                            name="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                                type="email"
                                id="email"
                                name="email"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                                type="text"
                                id="whatsapp"
                                name="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço de coleta</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center = { initialPosition } zoom = {15} onClick={handleSelectPosition}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position = {selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value = {selectedUF} onChange={handleSelectUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map( uf  => (
                                    <option key = {uf} value = {uf} > {uf} </option>
                                ))}
                            </select>                                
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value = {selectedCity} onChange={handleSelectCity}>
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key = {city.id} value = {city.name} > {city.name} </option>
                                ))}
                            </select>                                
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid ">
                        { items.map( item  => (
                            <li key = { item.id } 
                                onClick= { () => handleSelectItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                                >
                                <img src= { item.image_url } alt={ item.title }/>
                                <span>{ item.title}</span>
                            </li>  
                        ))};            
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>

            </form>
       </div>
    );
};

export default CreatePoint;