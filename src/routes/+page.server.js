import { fail } from "@sveltejs/kit"
import { HYGRAPH_TOKEN } from '$env/static/private'

export const prerender = false

// Public endpoint to Hygraph partners.fdndn.nl instance
const endpoint = 'https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/cln01zo7o062401ugcoer8q5w/master' 

export async function load({ url }) {
    const query = `query People {
        people {
          name
          email
          challenge
        }
      }
    `

    const people = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({
            query: query                   
        })
    })

    const peopleData = await people.json()

    return { people: peopleData.data.people }
    
}
  
export const actions = {
	default: async ({ request }) => {
        const formData = await request.formData()
        const formFields = {
            name: formData.get("name"),
            email: formData.get("email"),
            challenge: formData.get("challenge")
        }

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
            const token = HYGRAPH_TOKEN
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }

            // createPerson
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    query: `
                        mutation CreatePerson($name: String!, $email: String!, $challenge: String!) {
                            createPerson(data: { name: $name, email: $email, challenge: $challenge }) {
                                id
                                name
                                email
                                challenge
                            }
                        }
                        
                    `,
                    variables: {
                        name: formFields.name,
                        email: formFields.email,
                        challenge: formFields.challenge,
                    }                    
                })
            })

            const person = await response.json()

            // Publish person
            const publish = await fetch(endpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    query: `
                    mutation publishPerson($id: ID!) {
                        publishPerson(where: { id: $id }, to: PUBLISHED) {
                          id
                        }
                      }
                        
                    `,
                    variables: {
                        id:person.data.createPerson.id
                    }                    
                })
            })

            return person.data.createPerson
        }
    }
}
