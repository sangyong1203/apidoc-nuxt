import Excel from '~/services/common/xlsx/Excel.module.js'
import dayjs from 'dayjs'
import type { CoverPage, RequestType,  ResponseType } from './model_service/Type'

/**
 * 단일 인터페이스 엑셀생성
 * @param apiData Object  데이터 
 * @param title String 엑셀 테이블의 헤더 타이틀. ''빈값을 줄때는 sheet에 타이틀이 나타나지 안는다.
 * @param fileName String 엑셀파일 명
 * @example
 * 예: makeExcelAndDownload(apiData, '사용자목록 조회', '사용자목록엑셀파일')
 */
export const makeApiExcelAndDownload = (apiData: any, title: string,  fileName: string) => {
    const requestList:RequestType[] = apiData.request ?? []
    const responseList:ResponseType[] = apiData.response ?? []

    // --------------sheet style ---------------------
    const emptyColumnStyle = {
        // 마지막 빈 컬럼 hiden
        height: 24,
        width: 1,
    }
    const titleStyle = {
        verticalAlign: 'middle',
        textAlign: 'center',
        backgroundColor: '#b8cce4',
        fontSize: 18,
        fontWeight: 'bold',
        border: '1px solid #000000',
        height: 24,
    }
    const tableTitle = {
        verticalAlign: 'middle',
        textAlign: 'center',
        backgroundColor: '#d1d1d1',
        fontSize: 12,
        fontWeight: 'bold',
        border: '1px solid #000000',
    }
    const tableHeader = {
        textAlign: 'center',
        border: '1px solid #000000',
        verticalAlign: 'middle',
        backgroundColor: '#f1f1f1',
        fontWeight: 'bold',
        fontSize: 10,
    }
    const formLabelStyle = {
        textAlign: 'center',
        border: '1px solid #000000',
        verticalAlign: 'middle',
        backgroundColor: '#f1f1f1',
        fontSize: 10,
        width: 140,
        height: 24,
    }
    const formValueStyle = {
        textAlign: 'left',
        border: '1px solid #000000',
        verticalAlign: 'middle',
        fontSize: 10,
        width: 140,
        height: 24,
    }
    const tableItemStyle ={
        width: 140,
        fontSize: 10,
        textAlign: 'center',
        border: '1px solid #000000',
        verticalAlign: 'middle',
    } 
    const exampleCodeStyle = {
        height: 400,
        verticalAlign: 'middle',
        border: '1px solid #000000',

    }
    //-------------------------------------

    // sheet 기본 데이터 생성
    const sheet1 = {
        name: 'Sheet1',
        data: [] as any, // 컬럼 해더
    }
    // title에 값이 있으면 테이블 컬럼 해더 행 위에 타이틀 추가
    if (title) {
        sheet1.data.push([
            {
                text: title??'',
                colspan: 7,
                rowspan: 2,
                style: Object.assign({}, titleStyle),
            },
            // { style: emptyColumnStyle },
            {}, {}, {}, {}, {}, {}
        ])
        sheet1.data.push([{ style: emptyColumnStyle },{}, {}, {}, {}, {}, {}])
    }
    const sheetData = [
        [{ text: '인터페이스명', style: formLabelStyle, }, { text: apiData.interfaceName??'', colspan: 6, style: formValueStyle, }, {}, {}, {}, {}, {}],
        [{ text: '설명', style: formLabelStyle, }, { text: apiData.description??'', colspan: 6, style: formValueStyle, }, {}, {}, {}, {}, {}],
        [{ text: 'Header', style: formLabelStyle, }, { text: apiData.header??'', colspan: 6, style: formValueStyle, }, {}, {}, {}, {}, {}],
        [{ text: 'Request URL', style: formLabelStyle, }, { text: apiData.requestURL??'', colspan: 6, style: formValueStyle, }, {}, {}, {}, {}, {}],
        [{ text: 'HTTP Method', style: formLabelStyle, }, { text: apiData.httpMethod??'', colspan: 2, style: formValueStyle, }, { text: 'Required', style: formLabelStyle, },{ text: 'Y: 필수', colspan: 3, style: formValueStyle, }, {}, {}, {}],
        [{ text: 'Request' , colspan: 7 , style: Object.assign({}, tableTitle, { height: 30}) }, {}, {}, {}, {}, {}, {}],
        [{ text: 'Parameter' , colspan: 4, style: tableHeader, }, { text: 'Required', style: tableHeader,},{ text: 'Type', style: tableHeader, },{ text: 'Description', style: tableHeader, }, {}, {}, {}],
    ]
    sheetData.forEach( (item:any) => {
        sheet1.data.push(item)
    })
    requestList.forEach((item:any) => {
        if(item.level === 1){
            sheet1.data.push([{ text: item.parameter??'', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: '', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: item.requiredYn??'', style:tableItemStyle },{ text: item.type??'', style:tableItemStyle },{ text: item.description??'', style:tableItemStyle }])
        }
        if(item.level === 2){
            sheet1.data.push([{ text: '', style:tableItemStyle }, { text: item.parameter??'', style:tableItemStyle },{ text: '', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: item.requiredYn??'', style:tableItemStyle },{ text: item.type??'', style:tableItemStyle },{ text: item.description??'', style:tableItemStyle }])
        }
        if(item.level === 3){
            sheet1.data.push([{ text: '', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: item.parameter??'', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: item.requiredYn??'', style:tableItemStyle },{ text: item.type??'', style:tableItemStyle },{ text: item.description??'', style:tableItemStyle }])
        }
        if(item.level === 4){
            sheet1.data.push([{ text: '', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: '', style:tableItemStyle },{ text: item.parameter??'', style:tableItemStyle }, { text: item.requiredYn??'', style:tableItemStyle },{ text: item.type??'', style:tableItemStyle },{ text: item.description??'', style:tableItemStyle }])
        }
    })
    sheet1.data.push([{ text: 'Response' , colspan: 7 , style: Object.assign({}, tableTitle, { height: 30}) }, {}, {}, {}, {}, {}, {}])
    sheet1.data.push([{ text: 'Variable' , colspan: 4, style: tableHeader, }, { text: 'Required', style: tableHeader,},{ text: 'Type', style: tableHeader, },{ text: 'Description', style: tableHeader, }, {}, {}, {}])

    responseList.forEach((item:any) => {
        if(item.level === 1){
            sheet1.data.push([{ text: item.variable??'', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: '', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: item.requiredYn??'', style:tableItemStyle },{ text: item.type??'', style:tableItemStyle },{ text: item.description??'', style:tableItemStyle }])
        }
        if(item.level === 2){
            sheet1.data.push([{ text: '', style:tableItemStyle }, { text: item.variable??'', style:tableItemStyle },{ text: '', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: item.requiredYn??'', style:tableItemStyle },{ text: item.type??'', style:tableItemStyle },{ text: item.description??'', style:tableItemStyle }])
        }
        if(item.level === 3){
            sheet1.data.push([{ text: '', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: item.variable??'', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: item.requiredYn??'', style:tableItemStyle },{ text: item.type??'', style:tableItemStyle },{ text: item.description??'', style:tableItemStyle }])
        }
        if(item.level === 4){
            sheet1.data.push([{ text: '', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: '', style:tableItemStyle },{ text: item.variable??'', style:tableItemStyle }, { text: item.requiredYn??'', style:tableItemStyle },{ text: item.type??'', style:tableItemStyle },{ text: item.description??'', style:tableItemStyle }])
        }
    })
    sheet1.data.push([{ text: 'Request Example' , colspan: 7 , style: Object.assign({}, tableTitle, { height: 30}) }, {}, {}, {}, {}, {}, {}])
        
    sheet1.data.push([{ text: `${apiData.requestExample? JSON.stringify(apiData.requestExample??'', null, 2) : ''}` , colspan: 7 , style: exampleCodeStyle }, {}, {}, {}, {}, {}, {}])
    sheet1.data.push([{ text: 'Response Example' , colspan: 7 , style: Object.assign({}, tableTitle, { height: 30}) }, {}, {}, {}, {}, {}, {}])
    sheet1.data.push([{ text: `${apiData.responseExample ? JSON.stringify(apiData.responseExample??'',null,2) : ''}`, colspan: 7 , style: exampleCodeStyle }, {}, {}, {}, {}, {}, {}])

    console.log('sheet1.data', sheet1.data)
    Excel.make([sheet1], fileName ?? 'downloadExcel' + dayjs(new Date()).format('YYYY-MM-DD'))
}




/**
 * 모든 인터페이스 데이터를 엑셀생성
 * @param apiDataList Array  Api 데이터 리스트 
 * @param fileName String 엑셀파일 명
 * @example
 * 예: makeExcelAndDownloadAll(tableData,  '인터페이스엑셀파일')
 */
type RevisionHistory = {
    version: string
    updateDate: string
    updateType: string
    content: string
    creater: string
    reviewer: string
    approver: string
}
export const makeApiExcelAndDownloadAll = (coverPage:CoverPage, historyList:RevisionHistory[] ,apiDataList: any,  fileName: string) => {
    
    // --------------sheet style ---------------------
    const emptyColumnStyle = {
        // 마지막 빈 컬럼 hiden
        height: 24,
        width: 1,
    }
    const titleStyle = {
        verticalAlign: 'middle',
        textAlign: 'center',
        backgroundColor: '#b8cce4',
        fontSize: 18,
        fontWeight: 'bold',
        borderLeft: '1px solid #000000',
        borderBottom: '1px solid #000000',
        borderTop: '1px solid #000000',
        height: 24,
        fontFamily: '맑은 고딕',

    }
    const tableTitle = {
        verticalAlign: 'middle',
        textAlign: 'center',
        backgroundColor: '#d1d1d1',
        fontSize: 11,
        fontWeight: 'bold',
        border: '1px solid #000000',
        fontFamily: '맑은 고딕',

    }
    const tableHeader = {
        textAlign: 'center',
        border: '1px solid #000000',
        verticalAlign: 'middle',
        backgroundColor: '#f1f1f1',
        fontWeight: 'bold',
        fontSize: 10,
        fontFamily: '맑은 고딕',

    }
    const formLabelStyle = {
        textAlign: 'center',
        border: '1px solid #000000',
        verticalAlign: 'middle',
        backgroundColor: '#f1f1f1',
        fontSize: 10,
        width: 140,
        height: 24,
        fontFamily: '맑은 고딕',

    }
    const formValueStyle = {
        textAlign: 'left',
        border: '1px solid #000000',
        verticalAlign: 'middle',
        fontSize: 10,
        width: 140,
        height: 24,
        fontFamily: '맑은 고딕',

    }
    const tableItemStyle ={
        width: 140,
        fontSize: 10,
        textAlign: 'center',
        border: '1px solid #000000',
        verticalAlign: 'middle',
        fontFamily: '맑은 고딕',

    } 
    const exampleCodeStyle = {
        height: 350,
        verticalAlign: 'middle',
        border: '1px solid #000000',

    }
    //-------------------------------------


    const sheetList = []  // sheet 집합 

    // -------표지  ---------------------
    const coverTitleStyle = {
        verticalAlign: 'center',
        textAlign: 'left',
        fontSize: 28,
        fontWeight: 'bold',
        height: 80,
        width: 350,
        backgroundColor: '#f9f9f9',
        fontFamily: '맑은 고딕'
    }
    const coverInfoStyle = {
        verticalAlign: 'center',
        textAlign: 'center',
        fontSize: 11,
        height: 20,
        width: 140,
        border: '1px solid #000000',
        backgroundColor: '#f9f9f9',
        fontFamily: '맑은 고딕',
    }
    const blankRow = {
        backgroundColor: '#f9f9f9',
        height: 30,
    }
    const sideColumn = {
        backgroundColor: '#f9f9f9',
        width: 40

    }
    const copyrightStyle = {
        verticalAlign: 'center',
        textAlign: 'center',
        fontSize: 8,
        height: 24,
        backgroundColor: '#f9f9f9',
        fontFamily: '맑은 고딕',
    }
    const coverPageSheet = {
        name: '표지',
        data: [] as any
    }
    coverPageSheet.data.push([ {  text: '', colspan: 8, style: blankRow}])
    coverPageSheet.data.push([ {  text: '', colspan: 8, style: blankRow}])
    coverPageSheet.data.push([ {  text: '', colspan: 8, style: blankRow}])
    coverPageSheet.data.push([ {  text: '', colspan: 8, style: blankRow}])
    coverPageSheet.data.push([ {  text: '', style: sideColumn }, {  text: coverPage.title1??'', colspan: 7, style: Object.assign({}, coverTitleStyle)}])
    coverPageSheet.data.push([ {  text: '', style: sideColumn }, {  text: coverPage.title2??'', colspan: 7, style: Object.assign({}, coverTitleStyle, { borderBottom: '1px solid #000000'})}])
    coverPageSheet.data.push([ {  text: '', style: sideColumn }, {  text: coverPage.version??'', colspan: 7, style: Object.assign({}, coverTitleStyle, {fontSize: 30})}])
    coverPageSheet.data.push([ {  text: '', colspan: 8, style: Object.assign({}, blankRow)}])
    coverPageSheet.data.push([ {  text: '', colspan: 5, style: blankRow }, {  text: '배 포 일',  style: coverInfoStyle}, {  text: dayjs(coverPage.publishDate)?.format('YYYY-MM-DD')??'',  style: coverInfoStyle}, {  text: '', style: sideColumn }])
    coverPageSheet.data.push([ {  text: '', colspan: 5, style: blankRow }, {  text: '작 성 자',  style: coverInfoStyle}, {  text: coverPage.creater??'',  style: coverInfoStyle}, {  text: '', style: sideColumn }])
    coverPageSheet.data.push([ {  text: '', colspan: 5, style: blankRow }, {  text: '검 토 자',  style: coverInfoStyle}, {  text: coverPage.reviewer??'',  style: coverInfoStyle}, {  text: '', style: sideColumn }])
    coverPageSheet.data.push([ {  text: '', colspan: 5, style: blankRow }, {  text: '승 인 자',  style: coverInfoStyle}, {  text: coverPage.approver??'',  style: coverInfoStyle}, {  text: '', style: sideColumn }])
    coverPageSheet.data.push([ {  text: '', colspan: 8, style: blankRow}])
    coverPageSheet.data.push([ {  text: '', colspan: 8, style: blankRow}])
    coverPageSheet.data.push([ {  text: coverPage.copyright??'', colspan: 8, style: Object.assign({}, copyrightStyle, { borderTop:'1px solid #000000'})}])
    coverPageSheet.data.push([ {  text: coverPage.copyrightDescription??'', colspan: 8, style: Object.assign({}, copyrightStyle)}])


    sheetList.push(coverPageSheet)

    // -------개정 이력 ---------------------
    const historyListSheet = {
        name: '개정이력',
        data: [] as any
    }
    historyListSheet.data.unshift([{ style: emptyColumnStyle }])
    historyListSheet.data.unshift([
        {
            text: historyListSheet.name??'',
            colspan: 7,
            rowspan: 2,
            style: Object.assign({}, titleStyle),
        },
        { style: emptyColumnStyle },
    ])
    historyListSheet.data.push([{ text: '버전', style: tableTitle }, { text: '변경일', style: tableTitle},{ text: '구분', style:tableTitle }, { text: '내용', style: tableTitle }, { text: '작성자', style:tableTitle }, { text: '검토자', style:tableTitle }, { text: '승인자', style:tableTitle }])

    historyList.forEach( (item:RevisionHistory) => {
        historyListSheet.data.push([{ text: item.version??'', style:tableItemStyle }, { text: item.updateDate??'', style: tableItemStyle },{ text: item.updateType??'', style:tableItemStyle },{ text: item.content??'', style: Object.assign({}, tableItemStyle, { width: 500}) }, { text: item.creater??'', style:tableItemStyle }, { text: item.reviewer??'', style:tableItemStyle }, { text: item.approver??'', style:tableItemStyle }])
    })

    sheetList.push(historyListSheet)

    // -------인터페이스 목록 -------------

    const interfaceListSheet = {
        name: '인터페이스 목록',
        data: [] as any
    }
    interfaceListSheet.data.unshift([{ style: emptyColumnStyle }])
    interfaceListSheet.data.unshift([
        {
            text: interfaceListSheet.name??'',
            colspan: 5,
            rowspan: 2,
            style: Object.assign({}, titleStyle),
        },
        { style: emptyColumnStyle },
    ])
    interfaceListSheet.data.push([{ text: '인터페이스 명', style: tableTitle }, { text: 'Request URL', style: tableTitle},{ text: 'Http Method', style:tableTitle }, { text: '설명', style: tableTitle }, { text: '구분', style:tableTitle }])

    apiDataList.forEach( (item:any) => {
        interfaceListSheet.data.push([{ text: item.interfaceName??'', style:Object.assign({}, tableItemStyle, { width: 300})  }, { text: item.requestURL??'', link:`#${item.requestURL??''}!G1`, style:Object.assign({}, tableItemStyle, {underline: true, width: 400}) },{ text: item.httpMethod??'', style:tableItemStyle },{ text: item.description??'', style: Object.assign({}, tableItemStyle, { width: 500}) }, { text: item.clientType??'', style:tableItemStyle }])
    })

    sheetList.push(interfaceListSheet)


    // ----- 각 api sheet 생성 ---------------

    for( const apiData of apiDataList){

        const requestList = apiData.request??[]
        const responseList = apiData.response??[]
        const requestExample = apiData.requestExample ? JSON.parse(apiData.requestExample) : ''
        const responseExample = apiData.responseExample ? JSON.parse(apiData.responseExample) : ''

        const title = apiData.interfaceName??''
        // sheet 기본 데이터 생성
        const sheet1 = {
            name: apiData.interfaceName??'',
            data: [] as any, // 컬럼 해더
        }
        // title에 값이 있으면 테이블 컬럼 해더 행 위에 타이틀 추가
        if (title) {
            sheet1.data.unshift([{ style: emptyColumnStyle }])
            sheet1.data.unshift([
                {
                    text: title,
                    colspan: 6,
                    rowspan: 2,
                    style: Object.assign({}, titleStyle),
                },
                {
                    text: '목록',
                    link: `#인터페이스 목록!A1`,
                    rowspan: 2,
                    style: {fontSize: 12, textAlign: 'center', backgroundColor: '#b8cce4', underline: true, color: 'red', borderRight: '1px solid #000000', verticalAlign: 'middle',},
                },
                { style: emptyColumnStyle },
            ])
        }
        const sheetData = [
            [{ text: '인터페이스명', style: formLabelStyle, }, { text: apiData.interfaceName??'', colspan: 6, style: formValueStyle, }],
            [{ text: '설명', style: formLabelStyle, }, { text: apiData.description??'', colspan: 6, style: formValueStyle, }],
            [{ text: 'Header', style: formLabelStyle, }, { text: apiData.header??'', colspan: 6, style: formValueStyle, }],
            [{ text: 'Request URL', style: formLabelStyle, }, { text: apiData.requestURL??'', colspan: 6, style: formValueStyle, }],
            [{ text: 'HTTP Method', style: formLabelStyle, }, { text: apiData.httpMethod??'', colspan: 2, style: formValueStyle, }, { text: 'Required', style: formLabelStyle, },{ text: 'Y: 필수', colspan: 3, style: formValueStyle, }],
            [{ text: 'Request' , colspan: 7 , style: Object.assign({}, tableTitle, { height: 30}) }],
            [{ text: 'Parameter' , colspan: 4, style: tableHeader, }, { text: 'Required', style: tableHeader,},{ text: 'Type', style: tableHeader, },{ text: 'Description', style: tableHeader, },],
        ]
        sheet1.data.push(...sheetData)
        requestList.forEach((item:any) => {
            if(item.level === 1){
                sheet1.data.push([{ text: item.parameter??'', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: '', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: item.requiredYn??'', style:tableItemStyle },{ text: item.type??'', style:tableItemStyle },{ text: item.description??'', style:tableItemStyle }])
            }
            if(item.level === 2){
                sheet1.data.push([{ text: '', style:tableItemStyle }, { text: item.parameter??'', style:tableItemStyle },{ text: '', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: item.requiredYn??'', style:tableItemStyle },{ text: item.type??'', style:tableItemStyle },{ text: item.description??'', style:tableItemStyle }])
            }
            if(item.level === 3){
                sheet1.data.push([{ text: '', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: item.parameter??'', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: item.requiredYn??'', style:tableItemStyle },{ text: item.type??'', style:tableItemStyle },{ text: item.description??'', style:tableItemStyle }])
            }
            if(item.level === 4){
                sheet1.data.push([{ text: '', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: '', style:tableItemStyle },{ text: item.parameter??'', style:tableItemStyle }, { text: item.requiredYn??'', style:tableItemStyle },{ text: item.type??'', style:tableItemStyle },{ text: item.description??'', style:tableItemStyle }])
            }
        })
        sheet1.data.push([{ text: 'Response' , colspan: 7 , style: Object.assign({}, tableTitle, { height: 30}) }])
        sheet1.data.push([{ text: 'Variable' , colspan: 4, style: tableHeader, }, { text: 'Required', style: tableHeader,},{ text: 'Type', style: tableHeader, },{ text: 'Description', style: tableHeader, },])
    
        responseList.forEach((item:any) => {
            if(item.level === 1){
                sheet1.data.push([{ text: item.variable??'', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: '', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: item.requiredYn??'', style:tableItemStyle },{ text: item.type??'', style:tableItemStyle },{ text: item.description??'', style:tableItemStyle }])
            }
            if(item.level === 2){
                sheet1.data.push([{ text: '', style:tableItemStyle }, { text: item.variable??'', style:tableItemStyle },{ text: '', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: item.requiredYn??'', style:tableItemStyle },{ text: item.type??'', style:tableItemStyle },{ text: item.description??'', style:tableItemStyle }])
            }
            if(item.level === 3){
                sheet1.data.push([{ text: '', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: item.variable??'', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: item.requiredYn??'', style:tableItemStyle },{ text: item.type??'', style:tableItemStyle },{ text: item.description??'', style:tableItemStyle }])
            }
            if(item.level === 4){
                sheet1.data.push([{ text: '', style:tableItemStyle }, { text: '', style:tableItemStyle },{ text: '', style:tableItemStyle },{ text: item.variable??'', style:tableItemStyle }, { text: item.requiredYn??'', style:tableItemStyle },{ text: item.type??'', style:tableItemStyle },{ text: item.description??'', style:tableItemStyle }])
            }
        })
        sheet1.data.push([{ text: 'Request Example' , colspan: 7 , style: Object.assign({}, tableTitle, { height: 30}) }])
        sheet1.data.push([{ text: `${apiData.requestExample? JSON.stringify(requestExample??'', null, 2) : ''}` , colspan: 7 , style: exampleCodeStyle }])
        sheet1.data.push([{ text: 'Response Example' , colspan: 7 , style: Object.assign({}, tableTitle, { height: 30}) }])
        sheet1.data.push([{ text: `${apiData.responseExample ? JSON.stringify(responseExample??'',null,2) : ''}`, colspan: 7 , style: exampleCodeStyle }])
        sheetList.push(sheet1)
    }    


    Excel.make(sheetList, fileName ?? 'downloadExcel' + dayjs(new Date()).format('YYYY-MM-DD'))
}
