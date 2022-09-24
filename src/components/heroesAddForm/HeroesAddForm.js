import { useHttp } from '../../hooks/http.hook';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Spinner from '../spinner/Spinner';

import { useDispatch, useSelector } from 'react-redux';
import { useCreateHeroMutation } from '../../api/apiSlice';
import { selectAll } from '../heroesFilters/filtersSlice';
import store from '../../store';

const HeroesAddForm = () => {



    const [heroName, setHeroName] = useState('')
    const [heroDescr, setHeroDescr] = useState('')
    const [heroElement, setHeroElement] = useState('')

    const [createHero, { isLoading }] = useCreateHeroMutation();

    const { request } = useHttp();
    const dispatch = useDispatch();

    const filters = selectAll(store.getState())
    const { filtersLoadingStatus } = useSelector(state => state.filters)

    const onSubmitHandler = (e) => {
        e.preventDefault();

        const newHero = {
            id: uuidv4(),
            name: heroName,
            description: heroDescr,
            element: heroElement
        }

        createHero(newHero).unwrap()

        setHeroName('');
        setHeroDescr('');
        setHeroElement('');
    }

    const renderFilters = (filters, status) => {
        if (status === 'loading') {
            return <option><Spinner /></option>
        } else if (status === 'error') {
            return <option>Ошибка загрузки</option>
        }

        if (filters && filters.length > 0) {
            return filters.map(({ name, label }) => {

                if (name === 'all') return

                return <option key={name} value={name}>{label}</option >
            })
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input
                    required
                    type="text"
                    name="name"
                    className="form-control"
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}
                    id="name"
                    placeholder="Как меня зовут?" />
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="description"
                    className="form-control"
                    value={heroDescr}
                    onChange={(e) => setHeroDescr(e.target.value)}
                    id="description"
                    placeholder="Что я умею?"
                    style={{ "height": '130px' }} />
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select
                    required
                    className="form-select"
                    value={heroElement}
                    onChange={(e) => setHeroElement(e.target.value)}
                    id="element"
                    name="element">
                    <option value="">Я владею элементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;