# ApiDoc-Nuxt
Nuxt3로 구현한 Api 테스트 및 api 문서 작성을 위한 소프트웨어.

## 개발 환경

- Node.js. (v22.15.0 버전을 설치하여 사용하세요.)
- [Node.js 다운로드](https://nodejs.org/en/download)  <- 클릭하여 다운로드 페이지로 이동

## 주요 기술스택
- Vue3
- Nuxt3
- pinia
- vite
- typescript
- Element Plus
- scss
- html2canvas
- dayjs

## 설치 및 실행 명령어
```
    git clone http://192.168.0.121:3000/project/2024/air-bot/air-bot-frontend.git
    cd apidoc-nuxt
    npm install
    npm run dev

    npm run type-check
    npm run build
```

## 코딩 가이드 

### 명명 규칙 

1. 폴더
- 폴더는 '소문자'로만 작성하여 생성한다. (예: common )
- 단어가 2단어 이상일 경우 단어의 `camelCase`로 작성한다.

2. 파일명
- 파일은  `PascalCase` 형태로 작성하여 생성한다. (예: AppVersion )
- index.ts 파일은 소문자 

3. class
- class는 `PascalCase` 형태로 작성하여 생성한다. (예: UserService)

4. type (typescript에 type)
- type 명은 `PascalCase`로 작성하여 생성한다. (예: UserInfo)
- type.ts 안에 선언하는 type은 'type' 으로 선언한다. 예:

```ts
    // 예시:
    export type UserInfo = {
        userId: string
        userName: string
        age: string
    }
```

5. 상수
- 상수는 변수명, 키값 모두 `SNAKE_CASE`(대문자)로 작성한다.

```ts
    // 예시:
    export const AUTH_LEVEL = {
        MASTER: 1,
        ADMIN: 2,
        MANAGER: 3,
        MEMBER: 4,
    } as const
```

### model_service 작성 

#### Type.ts에 데이터 Type 정의 (가장 먼저 정의 할것 )

- 모든 타입은 `type` 키워드로 선언.

```ts
    // 예시:
    export type User = {
        name: string 
        age: number
    }
```

- type model 및 CRUD 데이터 타입 정의. type model에 모든 CRUD에 필요하는 데이터 타입을 선언 후 List, Item, CreateParams, UpdateParams, DeleteParams 타입을 `Pick` 사용하여 타입 정의 한다. 아래 예시코드에 `NoticeModel`이 type model이다. type model은 export 하지 않는다. 

```ts
    // 예시:
    type NoticeModel = {
        id: number 
        ids: number[] 
        title: string 
        createId: string
        createName: string 
        content: string 
        createDate: string 
    }
    export type NoticeList = Pick<NoticeModel, 'id' | 'title' | 'createId' | 'createName' | 'content' | 'createDate'>
    export type NoticeItem = Pick<NoticeModel, 'id' | 'title' | 'createId' | 'createName' | 'content' | 'createDate'>
    export type NoticeCreatePrams = Pick<NoticeModel, 'title' | 'content'>
    export type NoticeUpdatePrams = Pick<NoticeModel, 'id' | 'title' | 'content'>
    export type NoticeDeletePrams = Pick<NoticeModel, 'ids'>
``` 

- 2개 이상의 CRUD 세트인 경우, 각 역할별로 구분하여 장명한다.  예: NoticeList, NoticeItem,  UserList, UserItem 등

#### SelfApi.ts 작성

- SelfApi.ts에는 service에서 호출할 api fetch함수만 작성한다. 함수의 params는 `(params: Params)`로만 작성한다. 
`payload`에 `query`는 `GET`할때, `body`는 `POST, PUT,DELETE` 할때 사용한다. 모든 return 값은 `Proomise<APIResponse>` 타입이다.


#### Service.ts 작성

- Service파일에는 페이지에 사용할 service 로직 함수, api호출 함수, 데이터 변수 등을 작성한다. Service파일에는 SelfApi.ts 작성한 함수와 Types.ts에 타입을 여기에 import해서 사용한다. getList, getInfo등 데이터조회 함수는 받아온 데이터를 class 속성 변수에 직접 할당한다. return 필요없다.  

```ts
    // 예시:
    import api from './SelfApi.ts'
    import type { List, Item, CreatePrams, UpdatePrams, SearchParams, DeletePrams } from './Type.ts'

    export class Service {
        totalRow= 0
        list:List[]= []
        item:Item = {
            id: 0, 
            title: '',
            createId: '',
            createName: '',
            content: '',
            createDate: '',
        }
        async getList(param: SearchParams): Promise<void> {
            const res = await api.getList(param)
            this.list = res.data?.list??[]
            this.totalRow = res.data?.totalRow
        }
        async getInfo(params:{id:number}): Promise<void> {
            const res = await api.getInfo(params)
            this.item = res.data
        }
        async create(params:CreatePrams): Promise<any> {
            return await api.create(params)
        }
        async delete(params:DeletePrams): Promise<any> {
            return await api.delete(params)
        }
    }
```

[⬆️ Back to the top](#apidoc-nuxt)