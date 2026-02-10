import { fail } from "@sveltejs/kit"
import { HYGRAPH_TOKEN } from '$env/static/private'

// Folder-Based Routing:
// This file automatically belongs to the current route.
// Files ending in `.server.js` only run on the server.
export const prerender = false

// SSR (Server-Side Rendering):
// This endpoint is used during server-side rendering to fetch data
// before HTML is sent to the browser.
const endpoint =
  'https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/cln01zo7o062401ugcoer8q5w/master'

export async function load({ url }) {
    // URL-Driven Development:
    // The URL is the entry point for data loading.
    // Changing the URL could change what data is loaded.
    const query = `query People {
        people {
          name
          email
          challenge
        }
      }
    `

    // Web Standards:
    // fetch is a standard browser API, reused by SvelteKit on the server.
    const people = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ query })
    })

    const peopleData = await people.json()

    // State:
    // The returned object becomes page state and is serialized
    // into the HTML sent to the client.
    return { people: peopleData.data.people }
}

export const actions = {
    default: async ({ request }) => {
        // Progressive Enhancement:
        // This action works even if JavaScript is disabled.
        // With JS enabled, the client can enhance this interaction.
        const formData = await request.formData()

        const formFields = {
            name: formData.get("name"),
            email: formData.get("email"),
            challenge: formData.get("challenge")
        }

        // Server-side validation:
        // Never rely solely on client-side validation.
        if (formFields.name.length < 2) {
            return fail(400, {
                error: true,
                message: "Name must be at least 2 characters long",
                ...formFields
            })
        }

        await postFormData()

        return { success: true, ...formFields }

        async function postFormData() {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${HYGRAPH_TOKEN}`,
            }

            // Secure server-only mutation:
            // Tokens and business logic never reach the browser.
            const response = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    query: `
                        mutation CreatePerson(
                          $name: String!,
                          $email: String!,
                          $challenge: String!
                        ) {
                            createPerson(
                              data: {
                                name: $name,
                                email: $email,
                                challenge: $challenge
                              }
                            ) {
                                id
                            }
                        }
                    `,
                    variables: formFields
                })
            })

            const person = await response.json()

            // Publishing content happens server-side only
            await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    query: `
                        mutation publishPerson($id: ID!) {
                            publishPerson(where: { id: $id }, to: PUBLISHED) {
                              id
                            }
                        }
                    `,
                    variables: {
                        id: person.data.createPerson.id
                    }
                })
            })
        }
    }
}
