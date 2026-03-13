export async function serverSignOut(): Promise<void> {
    try {
        const res = await fetch('/auth/signout', {
            method: 'POST',
        })
        if (!res.ok) {
            throw new Error(`Signout failed: ${res.status} ${res.statusText}`)
        }
    } catch (error) {
        throw new Error("Error executing server signout")
    }
}
