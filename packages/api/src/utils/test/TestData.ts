import {DeepPartial, Repository} from 'typeorm'

export default class TestData<T extends {id: string}> {
  value?: T
  private _repo?: Repository<T>
  private shouldReset = true

  constructor(
    private readonly getRepo: () => Repository<T>,
    private readonly getData: () => DeepPartial<T>
  ) {
    beforeEach(async () => {
      if (this.shouldReset) {
        this.shouldReset = false
        this.value = await this.create()
      }
    })

    afterAll(async () => {
      await this.remove()
    })
  }

  get repo() {
    if (!this._repo) {
      this._repo = this.getRepo()
    }

    return this._repo
  }

  /**
   * Get the id, or throw an error if the value isn't present for some reason.
   */
  get id() {
    if (!this.value) {
      throw new Error('TestData value not found.')
    }

    return this.value.id
  }

  /**
   * Resets the data after this test.
   */
  resetAfter() {
    this.shouldReset = true
  }

  /**
   * Delete the data and reset it after this test.
   */
  async delete() {
    this.resetAfter()
    await this.remove()
  }

  private async create() {
    return this.repo.save({
      ...this.getData(),
      id: this.value?.id,
    })
  }

  private async remove() {
    return this.repo.delete(this.id)
  }
}
