/* ==========================================================================
   TALOHAMA MARQUES — v2
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     CONTATO — ÚNICO LUGAR PARA TROCAR O NÚMERO DO WHATSAPP
     Formato: código do país + DDD + número, só dígitos. Ex.: '5511999999999'
     Enquanto estiver como SEU_NUMERO, os botões avisam que falta configurar
     em vez de abrir um link quebrado.
  ------------------------------------------------------------------ */
  var WHATSAPP_NUMERO = 'SEU_NUMERO';

  var WHATSAPP_MENSAGENS = {
    agendar: 'Olá, Talohama! Vim pela sua página e gostaria de agendar uma conversa.',
    carreira: 'Olá, Talohama! Vim pela sua página e queria conversar sobre carreira.',
    mentoria: 'Olá, Talohama! Vim pela sua página e queria saber mais sobre mentoria.',
    lideranca: 'Olá, Talohama! Vim pela sua página e queria trocar sobre liderança e times.'
  };

  document.documentElement.classList.add('js');

  document.addEventListener('DOMContentLoaded', function () {
    initAbertura();
    initRetrato();
    initWhatsApp();
    initNavegacao();
    initEstrelas();
    initFormulario();
    initAno();
  });

  /* ------------------------------------------------------------------
     Abertura: dispara a única sequência de movimento da página.
  ------------------------------------------------------------------ */
  function initAbertura() {
    requestAnimationFrame(function () {
      document.documentElement.classList.add('is-ready');
    });
  }

  /* ------------------------------------------------------------------
     Retrato: some inteiro enquanto a foto não existir, em vez de
     mostrar imagem quebrada.
  ------------------------------------------------------------------ */
  function initRetrato() {
    var figura = document.getElementById('retrato');
    if (!figura) return;

    var img = figura.querySelector('img');
    if (!img) return;

    function esconder() { figura.style.display = 'none'; }

    if (img.complete && img.naturalWidth === 0) {
      esconder();
    } else {
      img.addEventListener('error', esconder);
    }
  }

  /* ------------------------------------------------------------------
     WhatsApp: monta os links de todos os CTAs a partir da constante acima.
  ------------------------------------------------------------------ */
  function initWhatsApp() {
    var configurado = /^\d{10,15}$/.test(WHATSAPP_NUMERO);
    var gatilhos = document.querySelectorAll('[data-whatsapp]');

    gatilhos.forEach(function (el) {
      var chave = el.getAttribute('data-whatsapp');
      var mensagem = WHATSAPP_MENSAGENS[chave] || WHATSAPP_MENSAGENS.agendar;

      if (!configurado) {
        el.addEventListener('click', function (evento) {
          evento.preventDefault();
          window.alert(
            'O número do WhatsApp ainda não foi configurado.\n\n' +
            'Abra o arquivo script.js e substitua SEU_NUMERO pelo número real, ' +
            'no formato 5511999999999.'
          );
        });
        return;
      }

      el.setAttribute(
        'href',
        'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + encodeURIComponent(mensagem)
      );
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    });
  }

  /* ------------------------------------------------------------------
     Navegação: menu no celular, com Esc e clique fora.
  ------------------------------------------------------------------ */
  function initNavegacao() {
    var botao = document.getElementById('nav-toggle');
    var nav = document.getElementById('nav');

    if (!botao || !nav) return;

    function fechar() {
      nav.classList.remove('is-open');
      botao.setAttribute('aria-expanded', 'false');
      botao.setAttribute('aria-label', 'Abrir menu');
    }

    function abrir() {
      nav.classList.add('is-open');
      botao.setAttribute('aria-expanded', 'true');
      botao.setAttribute('aria-label', 'Fechar menu');
    }

    botao.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) {
        fechar();
      } else {
        abrir();
      }
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', fechar);
    });

    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape' && nav.classList.contains('is-open')) {
        fechar();
        botao.focus();
      }
    });

    document.addEventListener('click', function (evento) {
      var dentro = nav.contains(evento.target) || botao.contains(evento.target);
      if (!dentro) fechar();
    });
  }

  /* ------------------------------------------------------------------
     Nota por estrelas, com teclado.
  ------------------------------------------------------------------ */
  function initEstrelas() {
    var grupo = document.getElementById('rating');
    var campo = document.getElementById('campo-nota');

    if (!grupo || !campo) return;

    var estrelas = Array.prototype.slice.call(grupo.querySelectorAll('.rating__star'));

    function pintar(valor) {
      estrelas.forEach(function (estrela) {
        var v = parseInt(estrela.getAttribute('data-value'), 10);
        estrela.classList.toggle('is-on', v <= valor);
        estrela.setAttribute('aria-checked', v === valor ? 'true' : 'false');
      });
    }

    function definir(valor) {
      campo.value = valor;
      pintar(valor);
    }

    estrelas.forEach(function (estrela) {
      estrela.addEventListener('click', function () {
        definir(parseInt(estrela.getAttribute('data-value'), 10));
      });

      estrela.addEventListener('mouseenter', function () {
        pintar(parseInt(estrela.getAttribute('data-value'), 10));
      });
    });

    grupo.addEventListener('mouseleave', function () {
      pintar(parseInt(campo.value, 10) || 0);
    });

    grupo.addEventListener('keydown', function (evento) {
      var atual = parseInt(campo.value, 10) || 0;

      if (evento.key === 'ArrowRight' || evento.key === 'ArrowUp') {
        evento.preventDefault();
        definir(Math.min(atual + 1, 5));
      } else if (evento.key === 'ArrowLeft' || evento.key === 'ArrowDown') {
        evento.preventDefault();
        definir(Math.max(atual - 1, 0));
      }
    });

    grupo.zerar = function () { definir(0); };
  }

  /* ------------------------------------------------------------------
     Formulário de feedback.
  ------------------------------------------------------------------ */
  function initFormulario() {
    var form = document.getElementById('feedbackForm');
    if (!form) return;

    form.addEventListener('submit', function (evento) {
      evento.preventDefault();

      var dados = coletar(form);
      var erros = validar(dados);

      limparErros(form);

      if (Object.keys(erros).length) {
        aplicarErros(erros);
        mostrarMensagem('fail', 'Revise os campos marcados e envie de novo.');
        return;
      }

      submitFeedback(dados, form);
    });
  }

  function coletar(form) {
    return {
      nome: form.nome.value.trim(),
      linkedin: form.linkedin.value.trim(),
      tipo_interacao: form.tipo_interacao.value,
      nota: parseInt(document.getElementById('campo-nota').value, 10) || 0,
      depoimento: form.depoimento.value.trim(),
      autorizado_publicar: form.autorizado_publicar.checked
    };
  }

  function validar(dados) {
    var erros = {};

    if (dados.nome.length < 2) erros.nome = 'Escreva seu nome.';
    if (dados.linkedin && !urlValida(dados.linkedin)) erros.linkedin = 'Use o endereço completo, começando com https://';
    if (!dados.tipo_interacao) erros.tipo = 'Escolha o tipo de interação.';
    if (dados.nota < 1) erros.nota = 'Dê uma nota de 1 a 5 estrelas.';
    if (dados.depoimento.length < 10) erros.depoimento = 'Conte um pouco mais — pelo menos 10 caracteres.';

    return erros;
  }

  function urlValida(valor) {
    try {
      var url = new URL(valor);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (e) {
      return false;
    }
  }

  function aplicarErros(erros) {
    Object.keys(erros).forEach(function (chave) {
      var alvoErro = document.getElementById('erro-' + chave);
      var alvoCampo = document.getElementById('campo-' + chave);

      if (alvoErro) alvoErro.textContent = erros[chave];
      if (alvoCampo) alvoCampo.classList.add('is-invalid');
    });
  }

  function limparErros(form) {
    form.querySelectorAll('.feedback__error').forEach(function (el) { el.textContent = ''; });
    form.querySelectorAll('.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); });
  }

  /* ------------------------------------------------------------------
     Envio. Ainda sem backend: valida e simula.
  ------------------------------------------------------------------ */
  function submitFeedback(dados, form) {
    var botao = form.querySelector('button[type="submit"]');

    if (botao) {
      botao.disabled = true;
      botao.textContent = 'Enviando';
    }

    // FUTURO BACKEND
    // POST /api/feedbacks
    //
    // fetch('/api/feedbacks', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(dados)
    // })
    //   .then(function (r) { return r.json(); })
    //   .then(function (r) { mostrarMensagem('ok', 'Obrigada pelo seu feedback!'); })
    //   .catch(function () { mostrarMensagem('fail', 'Não deu para enviar agora. Tente de novo em instantes.'); });
    //
    // Corpo esperado pela API (FastAPI + MySQL):
    // { nome, linkedin, tipo_interacao, nota, depoimento, autorizado_publicar }

    window.setTimeout(function () {
      console.log('Feedback (envio simulado, sem backend):', dados);

      mostrarMensagem('ok', 'Obrigada pelo seu feedback! Sua contribuição foi recebida.');
      form.reset();

      var grupo = document.getElementById('rating');
      if (grupo && grupo.zerar) grupo.zerar();

      if (botao) {
        botao.disabled = false;
        botao.textContent = 'Enviar feedback';
      }
    }, 800);
  }

  function mostrarMensagem(tipo, texto) {
    var el = document.getElementById('feedbackMessage');
    if (!el) return;

    el.textContent = texto;
    el.classList.remove('feedback__message--ok', 'feedback__message--fail');
    el.classList.add(tipo === 'ok' ? 'feedback__message--ok' : 'feedback__message--fail');

    if (tipo === 'ok') {
      window.setTimeout(function () {
        el.textContent = '';
        el.classList.remove('feedback__message--ok');
      }, 9000);
    }
  }

  function initAno() {
    var el = document.getElementById('ano');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------
     FUTURO BACKEND — depoimentos publicados
     GET /api/feedbacks/publicados
     Chamar no DOMContentLoaded quando a API existir.
  ------------------------------------------------------------------ */
  // function carregarDepoimentos() {
  //   fetch('/api/feedbacks/publicados')
  //     .then(function (r) { return r.json(); })
  //     .then(function (lista) {
  //       var alvo = document.getElementById('listaDepoimentos');
  //       if (!alvo || !lista.length) return;
  //
  //       alvo.innerHTML = lista.map(function (item) {
  //         return (
  //           '<figure class="testimonial">' +
  //             '<blockquote class="testimonial__quote">' + item.depoimento + '</blockquote>' +
  //             '<figcaption class="testimonial__meta">' +
  //               '<span class="testimonial__author">' + item.nome + '</span> — ' +
  //               '<span class="testimonial__score">' + '★'.repeat(item.nota) + '</span>' +
  //             '</figcaption>' +
  //           '</figure>'
  //         );
  //       }).join('');
  //     });
  // }

})();
