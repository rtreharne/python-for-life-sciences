'use strict';
const project = Number(new URLSearchParams(location.search).get('project') || '1');
const form = document.getElementById('generator');
const input = document.getElementById('student-id');
const results = document.getElementById('results');
const error = document.getElementById('error');
let urls = [];
document.getElementById('title').textContent = 'Project ' + project + ': your dataset';
function clearResults() {
  urls.forEach(url => URL.revokeObjectURL(url)); urls = [];
  results.replaceChildren(); error.textContent = ''; input.removeAttribute('aria-invalid');
}
input.addEventListener('input', clearResults);
form.addEventListener('submit', event => {
  event.preventDefault(); clearResults();
  try {
    const dataset = PortfolioDatasets.generate(input.value, project);
    const message = document.createElement('p');
    message.textContent = 'Dataset ready (version ' + dataset.version + '). Download the ZIP, open it, and keep the folder structure unchanged.';
    results.append(message);
    const list = document.createElement('ul');
    if (dataset.zip) {
      const zipUrl = URL.createObjectURL(new Blob([dataset.zip.bytes], {type:'application/zip'}));
      urls.push(zipUrl);
      const zipLink = document.createElement('a'); zipLink.href = zipUrl; zipLink.download = dataset.zip.name; zipLink.textContent = dataset.zip.name + ' (complete Project 1 folder)';
      const zipItem = document.createElement('li'); zipItem.append(zipLink); list.append(zipItem);
    }
    if (!dataset.zip) for (const file of dataset.files) {
      const url = URL.createObjectURL(new Blob([file.text], {type:'text/plain;charset=utf-8'}));
      urls.push(url);
      const link = document.createElement('a'); link.href = url; link.download = file.name; link.textContent = file.name;
      const item = document.createElement('li'); item.append(link); list.append(item);
    }
    results.append(list);
  } catch (failure) {
    error.textContent = failure.message; input.setAttribute('aria-invalid', 'true'); input.focus();
  }
});
