<script>
  import { enhance } from '$app/forms'

  /*
    SSR → Hydration → CSR (mental model):

    1. Server renders HTML using data from +page.server.js (SSR)
    2. HTML is sent to the browser and displayed immediately
    3. JavaScript loads and "hydrates" the HTML:
       - Svelte attaches event listeners
       - Reactive bindings become active
       - The DOM is NOT recreated
    4. The app continues as a client-side app (CSR)
  */
  let { form, data } = $props()

  // Client-side UI state:
  // This state exists only in the browser, not on the server.
  let loading = $state(false)

  function handleForm({ formElement, formData, action, cancel }) {

      /*
        use:enhance — what happens under the hood:

        WITHOUT enhance:
        - Browser performs a full page reload
        - Form is sent via HTTP POST
        - Server responds with a new HTML document

        WITH enhance:
        - Svelte intercepts the submit event
        - Prevents the browser’s default navigation
        - Sends the form using fetch()
        - Calls the server action in the background
        - Updates page state without reloading the page

        IMPORTANT:
        - The original HTML form behavior still exists
        - This is progressive enhancement, not replacement
      */

      loading = true

      return async ({ result, update }) => {

          /*
            update() — client/server synchronization:

            - update() re-runs the server `load()` function
            - New server state is sent back
            - Client UI updates declaratively
            - No manual DOM manipulation required
          */

          await setTimeout(() => {
              update()
              loading = false
          }, 1000)
      }
  }
</script>

<section id="aanmelden">
    <div class="inner">
        <header>
            <h2>Sign up for a design challenge</h2>
        </header>

        <!--
          Progressive Enhancement in practice:

          - Works as plain HTML (no JS)
          - Enhanced by Svelte if JS is available
          - Same server endpoint in both cases
        -->
        <form action="/" method="POST" use:enhance={handleForm}>

            {#if form?.error}
                <p class="message fail">{form.message}</p>
            {/if}

            <div>
                <fieldset>
                    <legend>Personal information</legend>

                    <!-- Web standards: native validation -->
                    <label>
                        <span>Name</span>
                        <input
                          type="text"
                          name="name"
                          minlength="2"
                          required
                          value="{form?.name ?? ''}"
                        />
                    </label>

                    <label>
                        <span>Email</span>
                        <input
                          type="email"
                          name="email"
                          required
                          value="{form?.email ?? ''}"
                        />
                    </label>
                </fieldset>

                <fieldset>
                    <legend>Challenge</legend>
                    <textarea name="challenge" rows="6" required value="{form?.challenge ?? ''}"></textarea>
                </fieldset>

                <footer>
                    <button>Submit</button>

                    {#if loading}
                        <!-- Client-only feedback -->
                        <span>Loading…</span>
                    {/if}

                    {#if form?.success}
                        <p class="message succes">
                          Successfully submitted
                        </p>
                    {/if}
                </footer>
            </div>

            <div>
                <h3>Design challenges</h3>

                <!--
                  Hydration explained:

                  - This list is rendered on the server
                  - HTML already contains the content
                  - During hydration, Svelte connects this HTML
                    to its reactive system
                  - No re-render, no DOM replacement
                -->
                {#each data?.people as person}
                    <p>
                        <strong>{person.name}</strong>
                        {person.challenge}
                    </p>
                {/each}
            </div>
        </form>
    </div>
</section>

<section>
  <div class="inner">
    <h2>(Meta) Frontend Framework Features</h2>

    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>Description</th>
          <th>Where it appears</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>URL-driven routing</td>
          <td>Routes and data loading are defined by the URL</td>
          <td>Folder-based routing, load()</td>
        </tr>
        <tr>
          <td>Server-side rendering (SSR)</td>
          <td>HTML is rendered on the server before sending to client</td>
          <td>+page.server.js</td>
        </tr>
        <tr>
          <td>Progressive enhancement</td>
          <td>Core functionality works without JavaScript</td>
          <td>HTML form + use:enhance</td>
        </tr>
        <tr>
          <td>Hydration</td>
          <td>Client activates server-rendered HTML</td>
          <td>$props(), reactive bindings</td>
        </tr>
        <tr>
          <td>Client-side state</td>
          <td>UI feedback without page reloads</td>
          <td>$state, conditional rendering</td>
        </tr>
        <tr>
          <td>Scoped styling</td>
          <td>Styles are isolated per component</td>
          <td>&lt;style&gt; in component</td>
        </tr>
      </tbody>
    </table>

    <h2>Frameworks concepts compared</h2>

    <table>
      <thead>
        <tr>
          <th>Concept</th>
          <th>SvelteKit</th>
          <th>Next.js / React</th>
          <th>Nuxt / Vue</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>File-based routing</td>
          <td>+page.svelte</td>
          <td>app/page.tsx</td>
          <td>pages/index.vue</td>
        </tr>
        <tr>
          <td>SSR data loading</td>
          <td>load()</td>
          <td>Server Components / getServerSideProps</td>
          <td>useAsyncData</td>
        </tr>
        <tr>
          <td>Form enhancement</td>
          <td>use:enhance</td>
          <td>Server Actions</td>
          <td>Native forms + Nitro</td>
        </tr>
        <tr>
          <td>Hydration</td>
          <td>Automatic</td>
          <td>hydrateRoot</td>
          <td>Automatic</td>
        </tr>
        <tr>
          <td>Scoped CSS</td>
          <td>Component styles</td>
          <td>CSS Modules</td>
          <td>&lt;style scoped&gt;</td>
        </tr>
      </tbody>
    </table>

    <h2>Differences between frameworks</h2>

    <table>
      <thead>
        <tr>
          <th>Aspect</th>
          <th>SvelteKit</th>
          <th>Next.js (React)</th>
          <th>Nuxt (Vue)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Default mental model</td>
          <td>Server-first, HTML-first</td>
          <td>Component-first, client-first (historically)</td>
          <td>Hybrid, progressive</td>
        </tr>
        <tr>
          <td>Progressive enhancement</td>
          <td>Built-in and encouraged</td>
          <td>Possible, but not the default</td>
          <td>Supported, but often abstracted</td>
        </tr>
        <tr>
          <td>Form handling</td>
          <td>Native HTML forms + server actions</td>
          <td>Server Actions or API routes</td>
          <td>Server routes or composables</td>
        </tr>
        <tr>
          <td>Hydration strategy</td>
          <td>Automatic, minimal JavaScript</td>
          <td>Automatic, often heavier bundles</td>
          <td>Automatic, configurable</td>
        </tr>
        <tr>
          <td>Client state philosophy</td>
          <td>Local, minimal, reactive</td>
          <td>Explicit hooks and stores</td>
          <td>Refs, reactive objects</td>
        </tr>
        <tr>
          <td>Rendering control</td>
          <td>Per route (SSR, CSR, static)</td>
          <td>Per page or component</td>
          <td>Per page or layout</td>
        </tr>
        <tr>
          <td>CSS scoping</td>
          <td>Automatic per component</td>
          <td>Manual (CSS Modules, styled)</td>
          <td>Built-in via &lt;style scoped&gt;</td>
        </tr>
        <tr>
          <td>Learning curve</td>
          <td>Low to medium</td>
          <td>Medium to high</td>
          <td>Medium</td>
        </tr>
        <tr>
          <td>Framework abstraction level</td>
          <td>Thin layer over web standards</td>
          <td>Thicker abstraction</td>
          <td>Moderate abstraction</td>
        </tr>
      </tbody>
    </table>

  </div>
</section>

<style>
/*
  Scoped CSS:
  These styles apply only to this component.
  Svelte rewrites selectors to prevent leakage to the global scope.
*/
section {
  margin:-1rem;
  padding: 4rem 1.5rem;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;

  .inner {
    max-width: 1100px;
    margin: 0 auto;
  }

  header {
    margin-bottom: 2rem;

    h2 {
      font-size: clamp(2rem, 4vw, 3rem);
      line-height: 1.1;
      margin: 0;
    }
  }

  form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    background: rgba(255, 255, 255, 0.05);
    padding: 2rem;
    border-radius: 1rem;
    backdrop-filter: blur(8px);

    @media (max-width: 800px) {
      grid-template-columns: 1fr;
    }

    > div {
      width: 100%;
    }

    fieldset {
      border: none;
      padding: 0;
      margin-bottom: 1.5rem;

      legend {
        font-weight: 600;
        margin-bottom: 0.75rem;
        opacity: 0.8;
      }

      label {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin-bottom: 1rem;

        span {
          font-size: 0.9rem;
          opacity: 0.85;
        }
      }
    }

    input,
    textarea {
      font-family: inherit;
      font-size: 1rem;
      padding: 0.75rem 0.9rem;
      border-radius: 0.5rem;
      border: 1px solid transparent;
      background: rgba(255, 255, 255, 0.9);
      color: #111;

      &:focus {
        outline: none;
        border-color: #66e5bf;
        box-shadow: 0 0 0 2px rgba(102, 229, 191, 0.3);
      }
    }

    textarea {
      resize: vertical;
      min-height: 180px;
      width:93%;
    }

    footer {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 1rem;

      button {
        appearance: none;
        border: none;
        border-radius: 999px;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        background: #66e5bf;
        color: #0f2027;
        transition: transform 0.15s ease, box-shadow 0.15s ease;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(102, 229, 191, 0.35);
        }

        &:active {
          transform: translateY(0);
          box-shadow: none;
        }
      }

      .loader {
        flex-shrink: 0;
      }

      .message {
        width: 100%;
        font-size: 0.9rem;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;

        &.fail {
          background: rgba(255, 80, 80, 0.15);
          color: #ffb3b3;
        }

        &.succes {
          background: rgba(102, 229, 191, 0.15);
          color: #66e5bf;
        }
      }
    }

    h3 {
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1.25rem;
    }

    p {
      margin-bottom: 1rem;
      line-height: 1.4;

      strong {
        display: block;
        font-size: 0.85rem;
        opacity: 0.75;
        margin-bottom: 0.25rem;
      }
    }
  }
}

table {
    width: 100%;
    border-collapse: collapse;
    margin: 2rem 0 4rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 0.95rem;
  }

  thead {
    background-color: #66e5bf;
    color:#111
  }

  thead th {
    text-align: left;
    padding: 0.75rem 1rem;
    font-weight: 600;
    border-bottom: 2px solid #111;
    width:calc(100 / sibling-count() * 1%);
  }

  tbody td {
    padding: 0.75rem 1rem;
    vertical-align: top;
    border-bottom: 1px solid #111;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover {
    background-color: #66e5bf;
    color:#111;
  }

  th,
  td {
    line-height: 1.4;
  }

  @media (max-width: 700px) {
    table {
      font-size: 0.9rem;
    }

    thead {
      display: none;
    }

    tbody tr {
      display: block;
      margin-bottom: 1.5rem;
      border-bottom: 2px solid #e5e7eb;
    }

    tbody td {
      display: block;
      padding: 0.5rem 0;
    }

    tbody td::before {
      content: attr(data-label);
      display: block;
      font-weight: 600;
      margin-bottom: 0.25rem;
      color: #555;
    }
  }
</style>
