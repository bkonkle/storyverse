export namespace Admin {
  const basePath = '/admin'

  export namespace Universes {
    const path = `${basePath}/universes`

    export const list = () => path

    export const create = () => `${path}/create`

    export const update = (id: string) => `${path}/${id.toLowerCase()}`
  }

  export namespace Series {
    const path = `${basePath}/series`

    export const list = () => path

    export const create = () => `${path}/create`

    export const update = (id: string) => `${path}/${id.toLowerCase()}`
  }

  export namespace Stories {
    const path = `${basePath}/stories`

    export const list = () => path

    export const create = () => `${path}/create`

    export const update = (id: string) => `${path}/${id.toLowerCase()}`
  }

  export namespace Authors {
    const path = `${basePath}/authors`

    export const list = () => path
  }

  export namespace User {
    const path = `${basePath}/user`

    export const profile = () => `${path}/profile`

    export const settings = () => `${path}/settings`
  }
}

export const home = () => '/'

export default {Admin, home}
