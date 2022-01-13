class Context
{
    public err: any
    public neverlose: any

    constructor(err: any, neverlose: any) {
        this.err = err;
        this.neverlose = neverlose;
    }

    get username() {
        return this.neverlose.username;
    }

    get method() {
        return this.neverlose.method;
    }

    get item_id() {
        return this.neverlose.item_id;
    }

    get id() {
        return this.neverlose.id;
    }

    get user_id() {
        return this.neverlose.user_id;
    }

    get code() {
        return this.neverlose.code;
    }

    get amount() {
        return this.neverlose.amount;
    }

    get product() {
        return this.neverlose.product;
    }

    get unique_id() {
        return this.neverlose.unique_id;
    }
}

export { Context };