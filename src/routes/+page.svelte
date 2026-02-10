<script>
  import { enhance } from '$app/forms'
    
  let { form, data } = $props();

  let loading = $state(false)

  function handleForm({formElement, formData, action, cancel }) {
      loading = true

      return async ({ result, update }) => {
          // fake slow api post request
          await setTimeout(() => {
              update()

              loading = false  
          }, 1000);
      }
  }
</script>


<section>
    <div class="inner">
        <header>
            <h2 class="large-heading">Meld je aan voor <br>een design challenge</h2>
        </header>

        <form action="/" method="POST" use:enhance={handleForm}> 
            {#if form?.error}
                <p class="message fail">{form.message}</p>
            {/if}

            <div>
                <fieldset>
                    <legend>Gegevens</legend>
                    <label><span class="medium-body">Naam</span> <input type="text" name="name" minlength="2" required value="{form?.name ?? ''}"  placeholder="Sam Jansen"/></label>
                    <label><span class="medium-body">Email</span> <input type="email" name="email" required value="{form?.email ?? ''}" placeholder="s.jansen@mail.nl"></label>
                </fieldset>

                <fieldset>
                    <legend>Opdracht</legend>
                    <label for="challenge" class="medium-body"><span>Design Challenge idee</span></label>
                    <textarea name="challenge" id="challenge" rows="10" required value="{form?.challenge ?? ''}"></textarea>
                </fieldset>

                <footer>
                    <button>Aanmelden</button>
                    {#if loading}
                        <svg class="loader" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <style>
                                .spinner_qM83{animation:spinner_8HQG .5s infinite; fill:#66e5bf}
                                .spinner_oXPr{animation-delay:.1s}.spinner_ZTLf{animation-delay:.2s}
                                @keyframes spinner_8HQG{0%,57.14%{animation-timing-function:cubic-bezier(0.33,.66,.66,1);transform:translate(0)}28.57%{animation-timing-function:cubic-bezier(0.33,0,.66,.33);transform:translateY(-6px)}100%{transform:translate(0)}}
                            </style>
                            <circle class="spinner_qM83" cx="4" cy="12" r="3"/>
                            <circle class="spinner_qM83 spinner_oXPr" cx="12" cy="12" r="3"/>
                            <circle class="spinner_qM83 spinner_ZTLf" cx="20" cy="12" r="3"/>
                        </svg>
                    {/if}

                    {#if form?.success}
                        <p class="message succes" class:active={form?.success}>Je hebt je aangemeld voor een design challenge</p>
                    {/if}
                </footer>
            </div>

            <div>
                <h3>Design Challenges voor 2024</h3>
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

<style>
section {
  height:100vh;
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
</style>
