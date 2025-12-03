<script>
  import { enhance } from '$app/forms'
    
  let { form, data } = $props();

  let loading = $state(false)

  function handleForm({formElement, formData, action, cancel }) {
      loading = true

      return async ({ result, update }) => {
          // fake api post
          await setTimeout(() => {
              update()

              loading = false  
          }, 1000);
      }

      // More Enhancements
      // https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation#validating_forms_using_javascript
      // https://superforms.rocks/ form library for SvelteKit
  }

</script>


<section id="aanmelden" class="cta-row">
    <div class="inner">
        <header>
            <h2 class="large-heading">Meld je aan voor <br>een design challenge</h2>
        </header>

        <!-- Enhance the form with the use:enhance prop -->
        <!-- Custom Enhance form with the use:enhance={handleForm} prop pointing to a custom form handler function -->
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
form {
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:1rem;
  width:auto;
}
form div {
    width: 100%
}
strong {
    font-size: .9em;
    display: block;
}
form footer {
    display:flex;
    align-items: center;
    gap:1rem;
    flex-wrap: wrap;
}
</style>