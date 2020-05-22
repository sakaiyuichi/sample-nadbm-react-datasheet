import React, { useState } from 'react'

// react-datasheet
// デフォルトのcssはフォントが小さいので自前のcssを作成
import ReactDataSheet from 'react-datasheet'
// import 'react-datasheet/lib/react-datasheet.css'
import './Sample.css'

// material-ui
import {
    Button,
    TextField,
} from '@material-ui/core/'

// 商品の選択肢
const selectShohins = [
    {id: '10', name: '産地〆マダイ養殖', tanka: '100'},
    {id: '20', name: 'アトランティクサーモン養殖', tanka: '200'},
    {id: '30', name: '活アサリ', tanka: '300'},
    {id: '40', name: 'カンパチフィレ', tanka: '400'},
]

// 商品の入力書式
const myShohinEditor = (props) => {

    const shohin = props.value

    // 入力値変更時
    const handleChange = (e) => {
        props.onChange(e.target.value)
    }

    return (
        // SelectはNativeのパーツでないと、フォーカスが外れてonChangeが反応しない？
        <TextField
            select
            variant="outlined"
            value={shohin}
            onChange={e => handleChange(e)}
            SelectProps={{
                native: true,
            }}
        >
            {selectShohins.map((option) => (
                <option key={option.id} value={option.id}>
                    {option.name}
                </option>
            ))}
        </TextField>
    )
}

// 商品の表示書式
const myShohinViewer = props => {
    // value値をもとに商品名に変換して表示する
    const value = props.value
    const shohin = selectShohins.find( item => item.id === value )
    return <b>{shohin.name}</b>
}

// 初期データ
const initialRows = [
    [
        { readOnly: true, value: '商品'},
        { readOnly: true, value: '単価'},
        { readOnly: true, value: '数量'},
    ],
    [
        { item: 'shohin', value: '10', dataEditor: myShohinEditor, valueViewer: myShohinViewer, className: 'myClass' },
        { item: 'tanka', value: '100' },
        { item: 'suryo', value: '' }
    ],
    [
        { item: 'shohin', value: '20', dataEditor: myShohinEditor, valueViewer: myShohinViewer, className: 'myClass' },
        { item: 'tanka', value: '200' },
        { item: 'suryo', value: '' }
    ],
    [
        { item: 'shohin', value: '30', dataEditor: myShohinEditor, valueViewer: myShohinViewer, className: 'myClass' },
        { item: 'tanka', value: '300' },
        { item: 'suryo', value: '' }
    ],
    [
        { item: 'shohin', value: '40', dataEditor: myShohinEditor, valueViewer: myShohinViewer, className: 'myClass' },
        { item: 'tanka', value: '400' },
        { item: 'suryo', value: '' }
    ],
]

// セルの値をレンダリングする際に呼ばれる
const myValueRenderer = (cell) => {
    // 単価と数量はカンマ区切りで表示する
    switch (cell.item) {
        case 'tanka':
        case 'suryo':
            return String(cell.value).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
            break
        default:
            return cell.value
            break
    }
}

const Sample = () => {

    // ステートフック
    const [rows, setRows] = useState(initialRows)

    // セル変更時
    const handleCellsChanged = (changes) => {
        const grid = rows.map(row => [...row])
        changes.forEach(({ cell, row, col, value }) => {
            grid[row][col] = { ...grid[row][col], value }
            // 更新されたのが商品列のとき、単価を上書き
            if (cell.item === 'shohin') {
                const shohin = selectShohins.find( item => item.id === value )
                grid[row][1].value = shohin.tanka
            }
        })
        setRows(grid)
    }

    // 値の表示
    const handleShowValue = () => {
        alert(JSON.stringify(rows))
    }
    
    return (
        <div>
            <ReactDataSheet
                data={rows}
                valueRenderer={cell => myValueRenderer(cell)}
                onCellsChanged={changes => handleCellsChanged(changes)}
            />
            <Button variant="contained" color="primary" onClick={() => handleShowValue()}>値の表示</Button>
            <pre>
                {JSON.stringify(rows, null, 2)}
            </pre>
        </div>
    )
}

export default Sample