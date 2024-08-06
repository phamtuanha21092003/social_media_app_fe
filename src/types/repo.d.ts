interface RepoInstance {
    [key: string]: (...args: any[]) => Promise<Response>
}
