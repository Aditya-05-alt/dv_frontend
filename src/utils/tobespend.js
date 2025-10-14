export function calculateToBeSpent(grossBudget, netBudget, markup) {
    const gross = parseFloat(grossBudget) || 0;
    const net = parseFloat(netBudget) || 0;
    const mark = parseFloat(markup) || 0;
    const spentValue = ((net)/(100+mark))*100
    return spentValue.toFixed(2);
}